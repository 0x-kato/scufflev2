import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  //TODO: change from 'me' to username?
  //implement guard here so that users with bearer token get returned their entire user info
  //maybe add tip history to this route if pass guard, if not then return blank profile page?
  @Get('me')
  getMe(@GetUser() user: User) {
    console.log({
      user,
    });
    return user;
  }
}
