import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtPayload } from '../types/JwtPayload.type';

// Setting up strategy to decorate other routes with
// User receives a token expiring after 3600 minutes to be able to tip other users

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('AT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    console.log(payload.sub + 'ATstrategy payload');
    return payload;
  }
}
