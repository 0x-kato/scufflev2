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
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class TipsService {
  constructor(private prisma: PrismaService) {}

  async sendTip(tipDto: TipsDto, userId: number): Promise<void> {
    const { receiverUsername, amount } = tipDto;
    const senderId = userId;

    try {
      await this.prisma.$transaction(async (prisma) => {
        const results: any = await prisma.$queryRaw`
        SELECT u.user_id, u.lowercase_username, b.balance 
        FROM "users" u
        JOIN "balances" b ON u.user_id = b.user_id
        WHERE u.lowercase_username = ${receiverUsername.toLowerCase()}
        OR u.user_id = ${senderId}
        FOR UPDATE`;

        if (results.length < 2) {
          throw new NotFoundException(`One or both users not found.`);
        }

        const senderBalance = results.find(
          (r) => r.user_id === senderId,
        )?.balance;
        const receiver = results.find(
          (r) => r.lowercase_username === receiverUsername.toLowerCase(),
        );

        if (!senderBalance || senderBalance < amount) {
          throw new Error('Insufficient sender balance.');
        }

        if (!receiver) {
          throw new NotFoundException(
            `Receiver with username "${receiverUsername}" not found.`,
          );
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
        throw (
          (new HttpException(
            'Conflict or deadlock detected, please retry your transaction.',
            HttpStatus.CONFLICT,
          ),
          console.error('Database error:', error.message))
        );
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
