import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import nock from 'nock';
import { AppModule } from './../src/app.module';

describe('ExchangeRateController (e2e)', () => {
  let app: INestApplication;
  const mockExchangeRate = {
    exchange_rate: 4.5,
  };
  const mockApiUrl = 'https://api.exchangerate.host';
  const mockApiKey = 'test-api-key';

  beforeAll(() => {
    process.env.EXCHANGE_RATE_PROVIDER_URL = mockApiUrl;
    process.env.EXCHANGE_RATE_PROVIDER_API_KEY = mockApiKey;
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    nock(mockApiUrl)
      .get('/')
      .matchHeader('x-api-key', mockApiKey)
      .reply(200, mockExchangeRate);
  });

  afterEach(async () => {
    await app.close();
    nock.cleanAll();
  });

  afterAll(() => {
    delete process.env.EXCHANGE_RATE_PROVIDER_URL;
    delete process.env.EXCHANGE_RATE_PROVIDER_API_KEY;
  });

  it('should return exchange rate data', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/exchange-rate')
      .expect(200);

    expect(body.exchange_rate).toBe(mockExchangeRate.exchange_rate);
  });

  it('should cache exchange rate response', async () => {
    let callsCount = 0;
    nock.cleanAll();
    nock(mockApiUrl)
      .get('/')
      .matchHeader('x-api-key', mockApiKey)
      .reply(200, () => {
        callsCount++;
        return mockExchangeRate;
      });

    const firstResponse = await request(app.getHttpServer())
      .get('/exchange-rate')
      .expect(200);

    const secondResponse = await request(app.getHttpServer())
      .get('/exchange-rate')
      .expect(200);

    expect(secondResponse.body).toEqual(firstResponse.body);
    expect(callsCount).toBe(1);
  });

  it('should handle API errors gracefully', async () => {
    nock.cleanAll();
    nock(mockApiUrl).get('/').matchHeader('x-api-key', mockApiKey).reply(500);

    const response = await request(app.getHttpServer())
      .get('/exchange-rate')
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain(
      'Request failed with status code 500',
    );
  });
});
