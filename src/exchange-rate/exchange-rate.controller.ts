import { CacheInterceptor } from '@nestjs/cache-manager';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import {
  ExchangeRateResponse,
  ExchangeRateService,
} from './exchange-rate.service';

@Controller('exchange-rate')
export class ExchangeRateController {
  constructor(private exchangeRateService: ExchangeRateService) {}

  @Get('/')
  @UseInterceptors(CacheInterceptor)
  async getExchangeRate(): Promise<ExchangeRateResponse> {
    return this.exchangeRateService.getExchangeRate();
  }
}
