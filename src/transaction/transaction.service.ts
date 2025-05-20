import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './transaction.entity';
import { TransactionRepository } from './transaction.repository';
import { ExchangeRateProviderService } from '../common/modules/exchange-rate-provider/exchange-rate-provider.service';
import {
  toIntegerFormat,
  EXCHANGE_RATE_MULTIPLIER,
} from '../common/utils/number.utils';
import Decimal from 'decimal.js';
import { TransactionMapper } from './transaction.mapper';
import { CreateTransactionResponseDto } from './dto/create-transaction-response.dto';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly exchangeRateProviderService: ExchangeRateProviderService,
    private readonly transactionMapper: TransactionMapper,
  ) {}

  async createTransaction(
    body: CreateTransactionDto,
  ): Promise<CreateTransactionResponseDto> {
    const exchangeRate =
      await this.exchangeRateProviderService.getExchangeRate();

    const transaction = new Transaction();
    transaction.amountPln = toIntegerFormat(
      this.calculateAmountPln(body.amount, exchangeRate),
    );
    transaction.amountEur = toIntegerFormat(body.amount);
    transaction.currencyRate = toIntegerFormat(
      exchangeRate,
      EXCHANGE_RATE_MULTIPLIER,
    );

    await this.transactionRepository.createTransaction(transaction);

    return this.transactionMapper.fromEntityToCreateTransactionResponseDto(
      transaction,
    );
  }

  private calculateAmountPln(amountEur: number, exchangeRate: number): number {
    return new Decimal(amountEur)
      .times(exchangeRate)
      .toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
      .toNumber();
  }
}
