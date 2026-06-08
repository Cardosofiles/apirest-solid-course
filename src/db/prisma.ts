import 'dotenv/config';

import { env } from '@/config/env.js';
import { PrismaClient } from '@/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL}`;
const schema = new URL(connectionString).searchParams.get('schema') ?? undefined;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in the environment variables.');
}

const adapter = new PrismaPg(
  {
    connectionString,
    ...(schema ? { options: `-c search_path="${schema}"` } : {}),
  },
  schema ? { schema } : undefined,
);
const prisma = new PrismaClient({
  adapter,
  log: env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
});

export { prisma };
