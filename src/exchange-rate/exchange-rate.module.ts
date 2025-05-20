import { Module } from '@nestjs/common';
import { ExchangeRateController } from './exchange-rate.controller';
import { ExchangeRateService } from './exchange-rate.service';
import { ExchangeRateProviderModule } from '../common/modules/exchange-rate-provider/exchange-rate-provider.module';
import { CacheConfig } from '../config/configuration';
import { ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        ttl: configService.get<CacheConfig>('cache').ttl,
      }),
      inject: [ConfigService],
    }),
    ExchangeRateProviderModule,
  ],
  controllers: [ExchangeRateController],
  providers: [ExchangeRateService],
  exports: [ExchangeRateService],
})
export class ExchangeRateModule {}
