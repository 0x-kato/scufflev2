import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AtGuard } from 'src/common/guard';
import TipsDto from './dto/tips.dto';
import { TipsService } from './tips.service';
import { GetCurrentUserId } from 'src/common/decorator';

@Controller('tips')
export class TipsController {
  constructor(private tipsService: TipsService) {}

  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  @Post('send')
  async sendTip(
    @Body() tipDto: TipsDto,
    @GetCurrentUserId() userId: number,
  ): Promise<void> {
    return this.tipsService.sendTip(tipDto, userId);
  }
}
