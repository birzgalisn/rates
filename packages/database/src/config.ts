import { type Config, defineConfig } from 'drizzle-kit';

const config = {
  schema: './src/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
  verbose: process.env.NODE_ENV === 'development',
  strict: true,
} satisfies Config;

export default defineConfig(config);
