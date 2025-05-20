import { Body, Controller, Post } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionService } from './transaction.service';
import { CreateTransactionResponseDto } from './dto/create-transaction-response.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Post('/')
  async createTransaction(
    @Body() body: CreateTransactionDto,
  ): Promise<CreateTransactionResponseDto> {
    return this.transactionService.createTransaction(body);
  }
}
