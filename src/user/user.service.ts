import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getBalance(userId: number): Promise<number> {
    const userBalance = await this.prisma.userBalance.findFirst({
      where: { user_id: userId },
    });
    return userBalance ? userBalance.balance : 0;
  }

  async updateMe(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
    let hash: string | undefined;
    if (updateUserDto.password) {
      hash = await argon.hash(updateUserDto.password);
    }

    const data: Prisma.UserUpdateInput = {
      ...updateUserDto,
      ...(hash && { hash }),
    };

    //need to add hash to db, not "password"
    if ('password' in data) {
      delete data.password;
    }

    console.log(data);
    const updateUser = await this.prisma.user.update({
      where: { user_id: userId },
      data,
    });

    return updateUser;
  }

  async deleteMe(userId: number): Promise<User> {
    const deletedUser = await this.prisma.user.delete({
      where: { user_id: userId },
    });

    return deletedUser;
  }
}
