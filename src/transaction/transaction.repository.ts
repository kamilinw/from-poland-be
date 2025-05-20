import { EntityRepository } from '@mikro-orm/core';
import { Transaction } from './transaction.entity';

export class TransactionRepository extends EntityRepository<Transaction> {
  async createTransaction(transaction: Transaction): Promise<void> {
    return this.em.fork().persistAndFlush(transaction);
  }
}
