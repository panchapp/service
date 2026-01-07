import { AppModule } from '@/app.module';
import { CustomExceptionFilter } from '@/common/filters/custom-exception.filter';
import { CustomValidationPipe } from '@/common/pipes/custom-validation.pipe';
import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const logger = app.get(Logger);

  // Logger Configuration
  app.useLogger(logger);
  app.flushLogs();

  // Hook configuration
  app.enableShutdownHooks();

  // Cookie parser middleware
  app.use(cookieParser());

  // Versioning configuration
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  });

  // Pipes configuration
  app.useGlobalPipes(new CustomValidationPipe());

  // Filters configuration
  app.useGlobalFilters(new CustomExceptionFilter(logger));

  // Start the application
  const port = app.get(ConfigService).get<number>('app.port')!;
  await app.listen(port);
}

bootstrap().catch((error) => {
  console.error('Error starting the application', error);
  process.exit(1);
});
