import {
  pgTable,
  numeric,
  timestamp,
  serial,
  index,
} from 'drizzle-orm/pg-core';

export const exchangeRates = pgTable(
  'exchange_rates',
  {
    id: serial('id').primaryKey(),
    audRate: numeric('aud_rate').notNull(),
    gbpRate: numeric('gbp_rate').notNull(),
    usdRate: numeric('usd_rate').notNull(),
    createdAt: timestamp('created_updated', { mode: 'string' }).defaultNow(),
  },
  (t) => ({
    idIndex: index('id_index').on(t.id),
    createdAtIndex: index('created_at_index').on(t.createdAt),
  }),
);
