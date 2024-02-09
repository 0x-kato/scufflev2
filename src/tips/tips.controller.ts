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

@Controller('tips')
export class TipsController {
  constructor(private tipsService: TipsService) {}

  @Post('/send-tip')
  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  async sendTip(@Body() tipDto: TipsDto) {
    return this.tipsService.sendTip(tipDto);
  }
}
