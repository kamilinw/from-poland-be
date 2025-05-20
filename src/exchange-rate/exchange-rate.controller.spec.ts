import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeRateController } from './exchange-rate.controller';
import { ExchangeRateService } from './exchange-rate.service';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { BadRequestException } from '@nestjs/common';

describe('ExchangeRateController', () => {
  let controller: ExchangeRateController;

  const mockExchangeRateService = {
    getExchangeRate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExchangeRateController],
      providers: [
        {
          provide: ExchangeRateService,
          useValue: mockExchangeRateService,
        },
      ],
    })
      .overrideInterceptor(CacheInterceptor)
      .useValue({})
      .compile();

    controller = module.get<ExchangeRateController>(ExchangeRateController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getExchangeRate', () => {
    it('should return exchange rate successfully', async () => {
      const mockResponse = { exchange_rate: 4.5 };
      mockExchangeRateService.getExchangeRate.mockResolvedValue(mockResponse);

      const result = await controller.getExchangeRate();

      expect(result).toEqual(mockResponse);
      expect(mockExchangeRateService.getExchangeRate).toHaveBeenCalledTimes(1);
    });

    it('should handle errors from the service', async () => {
      const error = new BadRequestException('Failed to fetch exchange rate');
      mockExchangeRateService.getExchangeRate.mockRejectedValue(error);

      await expect(controller.getExchangeRate()).rejects.toThrow(
        BadRequestException,
      );
      expect(mockExchangeRateService.getExchangeRate).toHaveBeenCalledTimes(1);
    });
  });
});
