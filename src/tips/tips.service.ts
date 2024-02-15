import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import TipsDto from './dto/tips.dto';
import TipHistoryDto from './dto/tipHistory.dto';
import TipReceivedDto from './dto/tipReceived.dto';
import { User, UserBalance } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class TipsService {
  constructor(private prisma: PrismaService) {}

  async sendTip(tipDto: TipsDto, userId: number): Promise<void> {
    const { receiverUsername, amount } = tipDto;
    const senderId = userId;

    try {
      await this.prisma.$transaction(async (prisma) => {
        const lowercaseUsername = receiverUsername.toLowerCase();
        const [receiver] = await prisma.$queryRaw<User[]>`
                SELECT * FROM "users"
                WHERE "lowercase_username" = ${lowercaseUsername}
                LIMIT 1 FOR UPDATE;`;
        if (!receiver) {
          throw new NotFoundException(
            `Receiver with username "${receiverUsername}" not found.`,
          );
        }

        const [senderBalance] = await this.prisma.$queryRaw<
          UserBalance[]
        >`SELECT "balance" FROM "balances" WHERE "user_id" = ${senderId} FOR UPDATE`;
        if (!senderBalance || senderBalance.balance < amount) {
          throw new Error('Insufficient sender balance.');
        }

        await prisma.userBalance.update({
          where: { user_id: senderId },
          data: { balance: { decrement: amount } },
        });

        await prisma.userBalance.update({
          where: { user_id: receiver.user_id },
          data: { balance: { increment: amount } },
        });

        await prisma.tip.create({
          data: {
            sender_id: senderId,
            receiver_id: receiver.user_id,
            amount,
            status: 'Completed',
          },
        });
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new HttpException(
          'Conflict or deadlock detected, please retry your transaction.',
          HttpStatus.CONFLICT,
        );
        console.error('Database error:', error.message);
      } else {
        throw error;
      }
    }
  }

  //for testing purposes
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getTipHistory(senderId: number): Promise<TipHistoryDto[]> {
    const tips = await this.prisma.tip.findMany({
      where: { sender_id: senderId },
      include: {
        sender: true,
        receiver: true,
      },
      orderBy: {
        tip_time: 'desc',
      },
    });

    return tips.map((tip) => new TipHistoryDto(tip));
  }

  async getReceivedHistory(receiverId: number): Promise<TipReceivedDto[]> {
    const tips = await this.prisma.tip.findMany({
      where: { receiver_id: receiverId },
      include: {
        sender: true,
        receiver: true,
      },
      orderBy: {
        tip_time: 'desc',
      },
    });

    return tips.map((tip) => new TipReceivedDto(tip));
  }
}
