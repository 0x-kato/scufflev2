import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getBalance(userId: number): Promise<number> {
    const userBalance = await this.prisma.userBalance.findFirst({
      where: { user_id: userId },
    });
    return userBalance ? userBalance.balance : 0;
  }
}
