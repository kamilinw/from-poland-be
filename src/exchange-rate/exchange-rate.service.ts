import { Injectable } from '@nestjs/common';
import { ExchangeRateProviderService } from '../common/modules/exchange-rate-provider/exchange-rate-provider.service';
export interface ExchangeRateResponse {
  exchange_rate: number;
}

@Injectable()
export class ExchangeRateService {
  constructor(
    private exchangeRateProviderService: ExchangeRateProviderService,
  ) {}

  async getExchangeRate(): Promise<ExchangeRateResponse> {
    const exchangeRate =
      await this.exchangeRateProviderService.getExchangeRate();
    return { exchange_rate: exchangeRate };
  }
}
