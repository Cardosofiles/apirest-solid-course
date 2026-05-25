import 'dotenv/config';

import { env } from '@/config/env.js';
import { PrismaClient } from '@/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({
  adapter,
  log: env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
});

export { prisma };
