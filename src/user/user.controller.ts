import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetCurrentUser } from 'src/common/decorator';
import { RtGuard } from 'src/common/guard';

@UseGuards(RtGuard)
@Controller('users')
export class UserController {
  //TODO: change from 'me' to username?
  //implement guard here so that users with bearer token get returned their entire user info
  //maybe add tip history to this route if pass guard, if not then return blank profile page?
  @Get('me')
  getMe(@GetCurrentUser() user: User) {
    console.log({
      user,
    });
    return user;
  }
}
