import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import TipsDto from './dto/tips.dto';

@Injectable()
export class TipsService {
  constructor(private prisma: PrismaService) {}

  async sendTip(tipDto: TipsDto, userId: number): Promise<void> {
    const { receiverUsername, amount } = tipDto;
    const senderId = userId;
    console.log(senderId, userId);

    if (!receiverUsername)
      throw new NotFoundException('Receiver username is required.');

    // Retrieve receiver user data
    const receiver = await this.prisma.user.findUnique({
      where: { username: receiverUsername },
    });
    if (!receiver)
      throw new NotFoundException(
        `Receiver with username "${receiverUsername}" not found.`,
      );

    // Retrieve sender and receiver balances
    const senderBalance = await this.prisma.userBalance.findUnique({
      where: { user_id: senderId },
    });
    if (!senderBalance || senderBalance.balance < amount)
      throw new Error('Insufficient sender balance.');

    // Perform transaction
    await this.prisma.$transaction(async (prisma) => {
      // Deduct amount from sender
      await prisma.userBalance.update({
        where: { user_id: senderId },
        data: { balance: { decrement: amount } },
      });

      // Add amount to receiver
      await prisma.userBalance.update({
        where: { user_id: receiver.user_id },
        data: { balance: { increment: amount } },
      });

      // Log the tip transaction
      await prisma.tip.create({
        data: {
          sender_id: senderId,
          receiver_id: receiver.user_id,
          amount,
          status: 'Completed', // or any other status based on your logic
        },
      });
    });
  }
}
