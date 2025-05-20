import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Transaction } from './transaction.entity';
import { ExchangeRateProviderModule } from '../common/modules/exchange-rate-provider/exchange-rate-provider.module';
import { TransactionMapper } from './transaction.mapper';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Transaction] }),
    ExchangeRateProviderModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionMapper],
})
export class TransactionModule {}
