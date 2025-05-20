import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from '@mikro-orm/core';
import { Transaction } from './transaction.entity';
import { TransactionRepository } from './transaction.repository';

describe('TransactionRepository', () => {
  let repository: TransactionRepository;
  let emMock: Partial<EntityManager>;
  let forkedEmMock: Partial<EntityManager>;

  beforeEach(async () => {
    forkedEmMock = {
      persistAndFlush: jest.fn().mockResolvedValue(undefined),
    };

    emMock = {
      fork: jest.fn(() => forkedEmMock as EntityManager),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: EntityManager,
          useValue: emMock,
        },
        {
          provide: TransactionRepository,
          useFactory: (em: EntityManager) =>
            new TransactionRepository(em, Transaction),
          inject: [EntityManager],
        },
      ],
    }).compile();

    repository = module.get<TransactionRepository>(TransactionRepository);
  });

  it('should call persistAndFlush with transaction on forked entity manager', async () => {
    const transaction = new Transaction();

    await repository.createTransaction(transaction);

    expect(emMock.fork).toHaveBeenCalled();
    expect(forkedEmMock.persistAndFlush).toHaveBeenCalledWith(transaction);
  });

  it('should propagate errors from persistAndFlush', async () => {
    const transaction = new Transaction();
    const error = new Error('DB error');
    (forkedEmMock.persistAndFlush as jest.Mock).mockRejectedValueOnce(error);

    await expect(repository.createTransaction(transaction)).rejects.toThrow(
      'DB error',
    );
  });
});
