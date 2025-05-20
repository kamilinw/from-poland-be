import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeRateProviderService } from './exchange-rate-provider.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { CacheKeys } from '../../enums/cache-keys';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ExchangeRateProviderService', () => {
  let service: ExchangeRateProviderService;

  const mockConfig = {
    exchangeRateProvider: {
      url: 'https://api.example.com/rates',
      apiKey: 'test-api-key',
    },
    cache: {
      ttl: 3600,
    },
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeRateProviderService,
        {
          provide: ConfigService,
          useValue: {
            get: jest
              .fn()
              .mockImplementation(
                (key: keyof typeof mockConfig) => mockConfig[key],
              ),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<ExchangeRateProviderService>(
      ExchangeRateProviderService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getExchangeRate', () => {
    it('should return cached exchange rate when available', async () => {
      const cachedRate = 4.5;
      mockCacheManager.get.mockResolvedValue(cachedRate);

      const result = await service.getExchangeRate();

      expect(result).toBe(cachedRate);
      expect(mockCacheManager.get).toHaveBeenCalledWith(
        CacheKeys.EXCHANGE_RATE,
      );
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it('should fetch exchange rate from API when cache is empty', async () => {
      mockCacheManager.get.mockResolvedValue(null);
      const apiResponse = { data: { exchange_rate: 4.2 } };
      mockedAxios.get.mockResolvedValue(apiResponse);

      const result = await service.getExchangeRate();

      expect(result).toBe(4.2);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        mockConfig.exchangeRateProvider.url,
        {
          headers: {
            'x-api-key': mockConfig.exchangeRateProvider.apiKey,
          },
        },
      );
      expect(mockCacheManager.set).toHaveBeenCalledWith(
        CacheKeys.EXCHANGE_RATE,
        4.2,
        mockConfig.cache.ttl,
      );
    });

    it('should throw BadRequestException when API call fails', async () => {
      mockCacheManager.get.mockResolvedValue(null);
      const error = new Error('API Error');
      mockedAxios.get.mockRejectedValue(error);

      await expect(service.getExchangeRate()).rejects.toThrow(
        BadRequestException,
      );
      expect(mockedAxios.get).toHaveBeenCalled();
    });
  });
});
