import { buildApp } from '@/app.js';
import { env } from '@/config/env.js';

async function bootstrap(): Promise<void> {
  const app = await buildApp();

  const signals = ['SIGINT', 'SIGTERM'] as const;

  for (const signal of signals) {
    process.on(signal, async () => {
      console.log(`\n⚠️  ${signal} recebido — encerrando servidor...`);

      await app.close();

      console.log('✅ Servidor encerrado com sucesso.');
      process.exit(0);
    });
  }

  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
    console.log(`🚀 Servidor rodando em http://localhost:${env.PORT}`);
    console.log(`❤️ Health em http://localhost:${env.PORT}/health-check`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

bootstrap();
