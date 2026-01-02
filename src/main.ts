import { AppModule } from '@/app.module';
import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Logger Configuration
  const logger = app.get(Logger);
  app.useLogger(logger);
  app.flushLogs();

  // Hook configuration
  app.enableShutdownHooks();

  // Versioning configuration
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  });

  // Start the application
  const port = app.get(ConfigService).get<number>('app.port')!;
  await app.listen(port);
}

bootstrap().catch((error) => {
  console.error('Error starting the application', error);
  process.exit(1);
});
