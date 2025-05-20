import { Test, TestingModule } from '@nestjs/testing';
import { TransactionMapper } from './transaction.mapper';
import { Transaction } from './transaction.entity';

describe('TransactionMapper', () => {
  let mapper: TransactionMapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionMapper],
    }).compile();

    mapper = module.get<TransactionMapper>(TransactionMapper);
  });

  describe('fromEntityToCreateTransactionResponseDto', () => {
    it('should correctly map Transaction to CreateTransactionResponseDto', () => {
      const transaction = new Transaction();
      transaction.amountEur = 10012;
      transaction.amountPln = 45099;
      transaction.currencyRate = 45678;

      const result =
        mapper.fromEntityToCreateTransactionResponseDto(transaction);

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(Object);
      expect(result.amountEur).toBe(100.12);
      expect(result.amountPln).toBe(450.99);
      expect(result.currencyRate).toBe(4.5678);
    });

    it('should handle zero values correctly', () => {
      const transaction = new Transaction();
      transaction.amountEur = 0;
      transaction.amountPln = 0;
      transaction.currencyRate = 0;

      const result =
        mapper.fromEntityToCreateTransactionResponseDto(transaction);

      expect(result).toBeDefined();
      expect(result.amountEur).toBe(0);
      expect(result.amountPln).toBe(0);
      expect(result.currencyRate).toBe(0);
    });

    it('should handle very large numbers correctly', () => {
      const transaction = new Transaction();
      transaction.amountEur = 99999999;
      transaction.amountPln = 999999999;
      transaction.currencyRate = 9999999;

      const result =
        mapper.fromEntityToCreateTransactionResponseDto(transaction);

      expect(result).toBeDefined();
      expect(result.amountEur).toBe(999999.99);
      expect(result.amountPln).toBe(9999999.99);
      expect(result.currencyRate).toBe(999.9999);
    });
  });
});
