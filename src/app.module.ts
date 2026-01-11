import { AppController } from '@/app.controller';
import { AuthModule } from '@/auth/auth.module';
import { getEnvConfig } from '@/config/env/env.config';
import { getLoggingConfig } from '@/config/logging/logging.config';
import { DatabaseModule } from '@/database/database.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(getEnvConfig()),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => getLoggingConfig(configService),
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
