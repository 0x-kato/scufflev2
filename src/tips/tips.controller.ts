import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AtGuard } from '../common/guard';
import TipsDto from './dto/tips.dto';
import { TipsService } from './tips.service';
import { GetCurrentUserId } from '../common/decorator';
import TipHistoryDto from './dto/tipHistory.dto';
import TipReceivedDto from './dto/tipReceived.dto';

@Controller('tips')
export class TipsController {
  constructor(private tipsService: TipsService) {}

  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  @Post('send')
  async sendTip(
    @Body() tipDto: TipsDto,
    @GetCurrentUserId() userId: number,
  ): Promise<void> {
    return this.tipsService.sendTip(tipDto, userId);
  }

  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  @Get('history')
  //need to make tip history dto
  async getTipHistory(
    @GetCurrentUserId() userId: number,
  ): Promise<TipHistoryDto[]> {
    return this.tipsService.getTipHistory(userId);
  }

  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  @Get('history-received')
  async getReceivedHistory(
    @GetCurrentUserId() userId: number,
  ): Promise<TipReceivedDto[]> {
    return this.tipsService.getReceivedHistory(userId);
  }
}
