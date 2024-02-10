import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetCurrentUser, GetCurrentUserId } from 'src/common/decorator';
import { AtGuard } from 'src/common/guard';
import { UserService } from './user.service';

@UseGuards(AtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  //TODO: change from 'me' to username?
  @Get('me')
  @HttpCode(HttpStatus.OK)
  getMe(@GetCurrentUser() user: User) {
    console.log({
      user,
    });
    return user;
  }

  @UseGuards(AtGuard)
  @Get('balance')
  @HttpCode(HttpStatus.OK)
  async getBalance(@GetCurrentUserId() userId: number): Promise<number> {
    // Assuming your guard attaches user info to req.user
    return this.userService.getBalance(userId);
  }
}
