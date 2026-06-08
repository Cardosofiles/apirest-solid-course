import 'dotenv/config';
import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import type { Environment } from 'vitest/environments';

function generateDatabaseUrl(schema: string) {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error('DATABASE_URL is not defined');
  }

  const urlObj = new URL(url);
  urlObj.searchParams.set('schema', schema);

  return urlObj.toString();
}

export default <Environment>{
  name: 'prisma',
  viteEnvironment: 'ssr',
  async setup() {
    const schema = randomUUID();
    const databaseUrl = generateDatabaseUrl(schema);

    process.env.DATABASE_URL = databaseUrl;

    execSync('npx prisma db push', {
      stdio: 'inherit',
      env: {
        ...process.env,
        DATABASE_URL: databaseUrl,
      },
    });

    const { prisma } = await import('../../src/db/prisma.js');

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
        await prisma.$disconnect();
      },
    };
  },
};
