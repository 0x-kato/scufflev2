import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import TipsDto from './dto/tips.dto';
import TipHistoryDto from './dto/tipHistory.dto';
import TipReceivedDto from './dto/tipReceived.dto';

@Injectable()
export class TipsService {
  constructor(private prisma: PrismaService) {}

  async sendTip(tipDto: TipsDto, userId: number): Promise<void> {
    const { receiverUsername, amount } = tipDto;
    const senderId = userId;

    if (!receiverUsername)
      throw new NotFoundException('Receiver username is required.');

    const receiver = await this.prisma.user.findUnique({
      where: { lowercase_username: receiverUsername.toLowerCase() },
    });
    if (!receiver)
      throw new NotFoundException(
        `Receiver with username "${receiverUsername}" not found.`,
      );

    await this.prisma.$transaction(async (prisma) => {
      const senderBalance = await prisma.userBalance.findUnique({
        where: { user_id: senderId },
      });
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
