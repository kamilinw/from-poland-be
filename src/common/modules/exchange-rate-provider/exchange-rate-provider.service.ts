import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { CacheKeys } from '../../enums/cache-keys';
import {
  AppConfig,
  CacheConfig,
  ExchangeRateProviderConfig,
} from '../../../config/configuration';
import { ExchangeRateResponse } from '../../../exchange-rate/exchange-rate.service';
import { Cache } from 'cache-manager';
@Injectable()
export class ExchangeRateProviderService {
  constructor(
    private configService: ConfigService<AppConfig>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getExchangeRate(): Promise<number> {
    const cachedExchangeRate = await this.cacheManager.get<number>(
      CacheKeys.EXCHANGE_RATE,
    );
    if (cachedExchangeRate) {
      return cachedExchangeRate;
    }

    const exchangeRateConfig =
      this.configService.get<ExchangeRateProviderConfig>(
        'exchangeRateProvider',
      );
    const url = exchangeRateConfig?.url;
    const apiKey = exchangeRateConfig?.apiKey;

    try {
      const response: AxiosResponse<ExchangeRateResponse> = await axios.get(
        `${url}`,
        {
          headers: {
            'x-api-key': apiKey,
          },
        },
      );

      await this.setExchangeRate(response.data.exchange_rate);

      return response.data.exchange_rate;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  private async setExchangeRate(exchangeRate: number): Promise<void> {
    await this.cacheManager.set(
      CacheKeys.EXCHANGE_RATE,
      exchangeRate,
      this.configService.get<CacheConfig>('cache').ttl,
    );
  }
}
