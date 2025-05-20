import {
  Entity,
  EntityRepositoryType,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { TransactionRepository } from './transaction.repository';

@Entity({ repository: () => TransactionRepository })
export class Transaction {
  [EntityRepositoryType]?: TransactionRepository;

  @PrimaryKey({ autoincrement: true })
  id!: number;

  @Property({ type: 'bigint' })
  amountPln!: number; // Amount is saved in hundredth part of the given currency i.ex. 98.12$ should be saved as 9812.

  @Property({ type: 'bigint' })
  amountEur!: number; // Amount is saved in hundredth part of the given currency i.ex. 98.12$ should be saved as 9812.

  @Property()
  currencyRate!: number; // Currency rate is saved in ten-thousandth part of the given currency i.ex. 4.1234$ should be saved as 41234.

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();
}
