import { Transform } from 'class-transformer';
import { IsEmail, IsString, Length } from 'class-validator';

export class AuthDto {
  @IsString()
  @Length(3, 20)
  @Transform(({ value }) => value?.toLowerCase())
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(5, 100)
  password: string;
}
