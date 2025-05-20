import { Module } from '@nestjs/common';
import { ExchangeRateProviderService } from './exchange-rate-provider.service';
import { CacheConfig } from '../../../config/configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        ttl: configService.get<CacheConfig>('cache').ttl,
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  providers: [ExchangeRateProviderService],
  exports: [ExchangeRateProviderService],
})
export class ExchangeRateProviderModule {}
