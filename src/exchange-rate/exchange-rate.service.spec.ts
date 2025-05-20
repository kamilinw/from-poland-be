import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeRateService } from './exchange-rate.service';
import { ExchangeRateProviderService } from '../common/modules/exchange-rate-provider/exchange-rate-provider.service';

describe('ExchangeRateService', () => {
  let service: ExchangeRateService;

  const mockExchangeRateProviderService = {
    getExchangeRate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeRateService,
        {
          provide: ExchangeRateProviderService,
          useValue: mockExchangeRateProviderService,
        },
      ],
    }).compile();

    service = module.get<ExchangeRateService>(ExchangeRateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getExchangeRate', () => {
    it('should return exchange rate in correct format', async () => {
      const mockExchangeRate = 4.5;
      mockExchangeRateProviderService.getExchangeRate.mockResolvedValue(
        mockExchangeRate,
      );

      const result = await service.getExchangeRate();

      expect(result).toEqual({ exchange_rate: mockExchangeRate });
      expect(
        mockExchangeRateProviderService.getExchangeRate,
      ).toHaveBeenCalledTimes(1);
    });

    it('should handle provider service errors', async () => {
      const error = new Error('Provider service error');
      mockExchangeRateProviderService.getExchangeRate.mockRejectedValue(error);

      await expect(service.getExchangeRate()).rejects.toThrow(
        'Provider service error',
      );
      expect(
        mockExchangeRateProviderService.getExchangeRate,
      ).toHaveBeenCalledTimes(1);
    });
  });
});
