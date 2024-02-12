import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { AuthDto, LoginDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Tokens, JwtPayload } from './types';
import LoginResponse from './interfaces/login-response.interface';

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: AuthDto): Promise<LoginResponse> {
    const hash = await argon.hash(dto.password);

    const user = await this.prisma
      .$transaction(async (prisma) => {
        const user = await prisma.user.create({
          data: {
            username: dto.username,
            email: dto.email,
            hash,
          },
        });

        await prisma.userBalance.create({
          data: {
            user_id: user.user_id,
            balance: 100, // setting the initial balance to 100 so users are able to tip
          },
        });

        return user;
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ForbiddenException('Email or username already exists');
          }
        }
        throw error;
      });

    const tokens = await this.getTokens(user.user_id, user.email);

    return { tokens, username: user.username, user_id: user.user_id };
  }

  async login(dto: LoginDto): Promise<LoginResponse> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('Wrong email/password.');

    const passwordMatches = await argon.verify(user.hash, dto.password);
    if (!passwordMatches) throw new ForbiddenException('Wrong email/password.');

    const tokens = await this.getTokens(user.user_id, user.email);

    return { tokens, username: user.username, user_id: user.user_id };
  }

  async logout(userId: number): Promise<boolean> {
    await this.prisma.user.updateMany({
      where: {
        user_id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });
    return true;
  }

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
    };

    // setting expiry really high for the sake of simple project
    const at = await this.jwt.signAsync(jwtPayload, {
      secret: this.config.get<string>('AT_SECRET'),
      expiresIn: '3600m',
    });

    return {
      access_token: at,
    };
  }
}
