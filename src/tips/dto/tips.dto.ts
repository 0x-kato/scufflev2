import { IsNotEmpty, IsString } from 'class-validator';

export default class TipsDto {
  senderId: number;

  @IsString()
  receiverUsername: string;

  @IsNotEmpty()
  amount: number;
}
