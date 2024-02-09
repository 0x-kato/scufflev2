import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetCurrentUser } from 'src/common/decorator';
import { AtGuard } from 'src/common/guard';
import { UserService } from './user.service';

@UseGuards(AtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  //TODO: change from 'me' to username?
  //implement guard here so that users with bearer token get returned their entire user info
  //maybe add tip history to this route if pass guard, if not then return blank profile page?
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
  async getBalance(@Req() req): Promise<number> {
    // Assuming your guard attaches user info to req.user
    return this.userService.getBalance(req.user.userId);
  }
}
