import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionModule } from './transaction/transaction.module';
import configuration from './config/configuration';
import { ConfigModule } from '@nestjs/config';
import { ExchangeRateModule } from './exchange-rate/exchange-rate.module';
import { ExchangeRateProviderModule } from './common/modules/exchange-rate-provider/exchange-rate-provider.module';
import { RequestContextMiddleware } from './common/middlewares/request-context.middleware';
import config from './mikro-orm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TransactionModule,
    ExchangeRateModule,
    ExchangeRateProviderModule,
    MikroOrmModule.forRoot(config),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
