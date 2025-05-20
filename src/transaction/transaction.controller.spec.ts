import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { BadRequestException } from '@nestjs/common';

describe('TransactionController', () => {
  let controller: TransactionController;

  const mockTransactionService = {
    createTransaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTransaction', () => {
    it('should create transaction successfully', async () => {
      const mockTransactionDto: CreateTransactionDto = {
        amount: 100,
      };

      mockTransactionService.createTransaction.mockResolvedValue(undefined);

      await controller.createTransaction(mockTransactionDto);

      expect(mockTransactionService.createTransaction).toHaveBeenCalledWith(
        mockTransactionDto,
      );
      expect(mockTransactionService.createTransaction).toHaveBeenCalledTimes(1);
    });

    it('should handle errors from the service', async () => {
      const mockTransactionDto: CreateTransactionDto = {
        amount: 100,
      };

      const error = new BadRequestException('Failed to create transaction');
      mockTransactionService.createTransaction.mockRejectedValue(error);

      await expect(
        controller.createTransaction(mockTransactionDto),
      ).rejects.toThrow(BadRequestException);
      expect(mockTransactionService.createTransaction).toHaveBeenCalledWith(
        mockTransactionDto,
      );
      expect(mockTransactionService.createTransaction).toHaveBeenCalledTimes(1);
    });
  });
});
