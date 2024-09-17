import { db } from './db';

import * as schema from './schema';

export type Db = typeof db;
export type Schema = typeof schema;
export type ExchangeRates = typeof schema.exchangeRates.$inferSelect;
