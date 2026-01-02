import { AppController } from '@/app.controller';
import { getEnvConfig } from '@/config/env/env.config';
import { getLoggingConfig } from '@/config/logging/logging.config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule.forRoot(getEnvConfig()),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => getLoggingConfig(configService),
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
