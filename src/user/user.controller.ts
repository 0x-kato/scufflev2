import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UserController {
  //TODO: change from 'me' to username?
  //implement guard here so that users with bearer token get returned their entire user info
  //maybe add tip history to this route if pass guard, if not then return blank profile page?
  @Get('me')
  getMe() {
    return 'user info';
  }
}
