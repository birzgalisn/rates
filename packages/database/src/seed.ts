import { db, sql } from './db';
import { exchangeRates } from './schema';

function generateRandomRate(min = 0.5, max = 2.5) {
  return (Math.random() * (max - min) + min).toFixed(4);
}

async function seedExchangeRates(count = 300) {
  return await db
    .transaction(async (tx) => {
      const existingCount = await tx
        .select({ count: sql<number>`count(*)` })
        .from(exchangeRates)
        .then(([result]) => result?.count ?? 0);

      if (existingCount > 0) {
        return;
      }

      const createdAt = new Date();
      const newRates = Array.from({ length: count }, (_, index) => ({
        audRate: generateRandomRate(1.2, 1.4),
        gbpRate: generateRandomRate(0.7, 0.85),
        usdRate: generateRandomRate(0.95, 1.05),
        createdAt: new Date(
          createdAt.getTime() - index * 24 * 60 * 60 * 1000,
        ).toISOString(),
      }));

      await tx.insert(exchangeRates).values(newRates);
    })
    .then(() => {
      console.log('Seeding completed successfully');
    }, console.error);
}

seedExchangeRates();
