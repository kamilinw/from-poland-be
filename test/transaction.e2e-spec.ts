import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import nock from 'nock';
import { AppModule } from './../src/app.module';
import { CreateTransactionDto } from '../src/transaction/dto/create-transaction.dto';
import { EntityManager } from '@mikro-orm/postgresql';
import { Transaction } from '../src/transaction/transaction.entity';

describe('TransactionController (e2e)', () => {
  let app: INestApplication;
  let em: EntityManager;
  const mockExchangeRate = {
    exchange_rate: 4.5241,
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
    app.useGlobalPipes(new ValidationPipe());
    em = app.get(EntityManager).fork();
    await app.init();

    nock(mockApiUrl)
      .get('/')
      .matchHeader('x-api-key', mockApiKey)
      .reply(200, mockExchangeRate);
  });

  afterEach(async () => {
    await em.nativeDelete(Transaction, {});
    nock.cleanAll();
  });

  afterAll(async () => {
    await app.close();
    delete process.env.EXCHANGE_RATE_PROVIDER_URL;
    delete process.env.EXCHANGE_RATE_PROVIDER_API_KEY;
  });

  const validTransaction: CreateTransactionDto = {
    amount: 100,
  };

  it('should create a transaction with valid amount', async () => {
    await request(app.getHttpServer())
      .post('/transaction')
      .send(validTransaction)
      .expect(201);

    const transactions = await em.find(Transaction, {});

    expect(transactions[0]).not.toBeNull();
    expect(transactions[0].amountPln).toBe(
      validTransaction.amount * mockExchangeRate.exchange_rate * 100,
    );
    expect(transactions[0].amountEur).toBe(validTransaction.amount * 100);
    expect(transactions[0].createdAt).toStrictEqual(expect.any(Date));
    expect(transactions[0].currencyRate).toBe(
      mockExchangeRate.exchange_rate * 10000,
    );
  });

  it('should reject transaction with negative amount', () => {
    return request(app.getHttpServer())
      .post('/transaction')
      .send({ amount: -100 })
      .expect(400);
  });

  it('should reject transaction with amount exceeding maximum', () => {
    return request(app.getHttpServer())
      .post('/transaction')
      .send({ amount: 1000001 })
      .expect(400);
  });

  it('should reject transaction with invalid amount type', () => {
    return request(app.getHttpServer())
      .post('/transaction')
      .send({ amount: 'invalid' })
      .expect(400);
  });

  it('should return correct response structure when creating transaction', async () => {
    const response = await request(app.getHttpServer())
      .post('/transaction')
      .send(validTransaction)
      .expect(201);

    expect(response.body.amountEur).toBe(100);
    expect(response.body.amountPln).toBe(452.41);
    expect(response.body.currencyRate).toBe(4.5241);
    expect(new Date(response.body.createdAt)).toBeInstanceOf(Date);
  });
});
