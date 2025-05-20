import { IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

const TRANSACTION_MAX_AMOUNT = 1000000;

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'Amount must be positive' })
  @Max(TRANSACTION_MAX_AMOUNT, {
    message: 'Amount cannot exceed 100,000,000 EUR',
  })
  amount: number;
}
