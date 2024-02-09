import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import TipsDto from './dto/tips.dto';

@Injectable()
export class TipsService {
  constructor(private prisma: PrismaService) {}

  async sendTip(tipDto: TipsDto): Promise<void> {
    const { senderId, receiverId, amount } = tipDto;

    // check for the existence of sender and receiver balance records
    /*------------------------------------------------------*/
    const senderBalance = await this.prisma.userBalance.findUnique({
      where: { user_id: senderId },
    });
    const receiverBalance = await this.prisma.userBalance.findUnique({
      where: { user_id: receiverId },
    });
    if (!senderBalance) {
      throw new Error('Sender does not have a balance record.');
    }
    if (!receiverBalance) {
      throw new Error('Receiver does not have a balance record.');
    }
    /*------------------------------------------------------*/

    // check sender balance
    if (senderBalance.balance < amount) {
      throw new Error('Insufficient balance.');
    }

    // start transaction
    await this.prisma.$transaction(async (prisma) => {
      // Update sender's balance
      await prisma.userBalance.update({
        where: { user_id: senderId },
        data: { balance: { decrement: amount } },
      });

      // update receiver's balance
      await prisma.userBalance.update({
        where: { user_id: receiverId },
        data: { balance: { increment: amount } },
      });

      // create a tip record
      await prisma.tip.create({
        data: {
          sender_id: senderId,
          receiver_id: receiverId,
          amount,
          status: 'Completed',
        },
      });
    });
  }
}
