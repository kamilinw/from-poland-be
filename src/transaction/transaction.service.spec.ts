import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { TransactionRepository } from './transaction.repository';
import { ExchangeRateProviderService } from '../common/modules/exchange-rate-provider/exchange-rate-provider.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionMapper } from './transaction.mapper';
import { CreateTransactionResponseDto } from './dto/create-transaction-response.dto';

describe('TransactionService', () => {
  let service: TransactionService;

  const mockTransactionRepository = {
    createTransaction: jest.fn(),
  };

  const mockExchangeRateProviderService = {
    getExchangeRate: jest.fn(),
  };

  const mockTransactionMapper = {
    fromEntityToCreateTransactionResponseDto: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: TransactionRepository,
          useValue: mockTransactionRepository,
        },
        {
          provide: ExchangeRateProviderService,
          useValue: mockExchangeRateProviderService,
        },
        {
          provide: TransactionMapper,
          useValue: mockTransactionMapper,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTransaction', () => {
    const createTransactionDto: CreateTransactionDto = {
      amount: 100.5,
    };

    const mockResponseDto: CreateTransactionResponseDto = {
      amountEur: 100.5,
      amountPln: 452.25,
      currencyRate: 4.5,
    };

    it('should create transaction successfully', async () => {
      const exchangeRate = 4.5;
      mockExchangeRateProviderService.getExchangeRate.mockResolvedValue(
        exchangeRate,
      );
      mockTransactionRepository.createTransaction.mockResolvedValue(undefined);
      mockTransactionMapper.fromEntityToCreateTransactionResponseDto.mockReturnValue(
        mockResponseDto,
      );

      const result = await service.createTransaction(createTransactionDto);

      expect(
        mockExchangeRateProviderService.getExchangeRate,
      ).toHaveBeenCalled();
      expect(mockTransactionRepository.createTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          amountEur: 10050,
          amountPln: 45225,
          currencyRate: 45000,
        }),
      );
      expect(
        mockTransactionMapper.fromEntityToCreateTransactionResponseDto,
      ).toHaveBeenCalled();
      expect(result).toEqual(mockResponseDto);
    });

    it('should handle repository errors', async () => {
      const exchangeRate = 4.5;
      mockExchangeRateProviderService.getExchangeRate.mockResolvedValue(
        exchangeRate,
      );
      mockTransactionRepository.createTransaction.mockRejectedValue(
        new Error('DB Error'),
      );

      await expect(
        service.createTransaction(createTransactionDto),
      ).rejects.toThrow('DB Error');
      expect(
        mockTransactionMapper.fromEntityToCreateTransactionResponseDto,
      ).not.toHaveBeenCalled();
    });

    it('should return correct response DTO with mapped values', async () => {
      const exchangeRate = 4.5;
      const inputAmount = 100.5;
      const expectedResponse: CreateTransactionResponseDto = {
        amountEur: 100.5,
        amountPln: 452.25,
        currencyRate: 4.5,
      };

      mockExchangeRateProviderService.getExchangeRate.mockResolvedValue(
        exchangeRate,
      );
      mockTransactionRepository.createTransaction.mockResolvedValue(undefined);
      mockTransactionMapper.fromEntityToCreateTransactionResponseDto.mockReturnValue(
        expectedResponse,
      );

      const result = await service.createTransaction({ amount: inputAmount });

      expect(result).toEqual(expectedResponse);
      expect(
        mockTransactionMapper.fromEntityToCreateTransactionResponseDto,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          amountEur: 10050,
          amountPln: 45225,
          currencyRate: 45000,
        }),
      );
    });

    it.each`
      amount    | rate   | expectedEur | expectedPln | expectedRate
      ${100.5}  | ${4.5} | ${10050}    | ${45225}    | ${45000}
      ${0.01}   | ${4.5} | ${1}        | ${5}        | ${45000}
      ${1000.0} | ${4.5} | ${100000}   | ${450000}   | ${45000}
    `(
      'should calculate amounts correctly for amount $amount with rate $rate',
      async ({ amount, rate, expectedEur, expectedPln, expectedRate }) => {
        mockExchangeRateProviderService.getExchangeRate.mockResolvedValue(rate);
        mockTransactionRepository.createTransaction.mockResolvedValue(
          undefined,
        );
        mockTransactionMapper.fromEntityToCreateTransactionResponseDto.mockReturnValue(
          {
            amountEur: amount,
            amountPln: amount * rate,
            currencyRate: rate,
          },
        );

        await service.createTransaction({ amount });

        expect(
          mockTransactionRepository.createTransaction,
        ).toHaveBeenCalledWith(
          expect.objectContaining({
            amountEur: expectedEur,
            amountPln: expectedPln,
            currencyRate: expectedRate,
          }),
        );
      },
    );
  });
});
