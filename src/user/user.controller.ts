import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetCurrentUser, GetCurrentUserId } from '../common/decorator';
import { AtGuard } from '../common/guard';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto';

@UseGuards(AtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  //R
  @Get('me')
  @HttpCode(HttpStatus.OK)
  getMe(@GetCurrentUser() user: User) {
    console.log({
      user,
    });
    return user;
  }

  //R
  @Get('balance')
  @HttpCode(HttpStatus.OK)
  async getBalance(@GetCurrentUserId() userId: number): Promise<number> {
    return this.userService.getBalance(userId);
  }

  //U
  @Patch('update')
  @HttpCode(HttpStatus.OK)
  updateMe(
    @GetCurrentUserId() userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    console.log({
      userId,
      updateUserDto,
    });
    return this.userService.updateMe(userId, updateUserDto);
  }

  //D
  @Delete('delete')
  @HttpCode(HttpStatus.ACCEPTED)
  deleteMe(@GetCurrentUserId() userId: number): Promise<User> {
    console.log(`${userId} has been deleted from the database.`);
    return this.userService.deleteMe(userId);
  }
}
