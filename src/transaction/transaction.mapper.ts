import { Injectable } from '@nestjs/common';
import { Transaction } from './transaction.entity';
import { CreateTransactionResponseDto } from './dto/create-transaction-response.dto';
import { toFixedPoint } from 'src/common/utils/number.utils';

@Injectable()
export class TransactionMapper {
  fromEntityToCreateTransactionResponseDto(
    transaction: Transaction,
  ): CreateTransactionResponseDto {
    return {
      amountEur: toFixedPoint(transaction.amountEur),
      amountPln: toFixedPoint(transaction.amountPln),
      currencyRate: toFixedPoint(transaction.currencyRate, 4),
    };
  }
}
