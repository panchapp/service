import { validate } from '@/config/env/env.validation';
import dotenv from 'dotenv';

dotenv.config({ path: '.env', override: true });

function envConfig() {
  return {
    // Application
    app: {
      port: Number.parseInt(process.env.PORT!, 10),
      nodeEnv: process.env.NODE_ENV!,
    },

    // Logging
    logging: {
      level: process.env.LOG_LEVEL!,
      enableRequestLogging: process.env.ENABLE_REQUEST_LOGGING === 'true',
    },

    // Database
    postgres: {
      host: process.env.POSTGRES_DB_HOST!,
      port: Number.parseInt(process.env.POSTGRES_DB_PORT!, 10),
      database: process.env.POSTGRES_DB_NAME!,
      username: process.env.POSTGRES_DB_USER!,
      password: process.env.POSTGRES_DB_PASSWORD!,
      ssl: process.env.POSTGRES_DB_SSL!,
    },

    // Auth
    auth: {
      jwtSecret: process.env.JWT_SECRET!,
      // In Milliseconds
      jwtExpirationTime: Number.parseInt(process.env.JWT_EXPIRATION_TIME!, 10),
      jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
      // In Milliseconds
      jwtRefreshExpirationTime: Number.parseInt(
        process.env.JWT_REFRESH_EXPIRATION_TIME!,
        10,
      ),
      cookieSecure: process.env.COOKIE_SECURE === 'true',
      cookieSameSite: process.env.COOKIE_SAME_SITE!,
      googleClientId: process.env.GOOGLE_CLIENT_ID!,
      googleClientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL!,
      frontendErrorUrl: process.env.FRONTEND_ERROR_URL!,
      frontendSuccessUrl: process.env.FRONTEND_SUCCESS_URL!,
    },
  };
}

export function getEnvConfig() {
  return {
    load: [envConfig],
    validate,
    isGlobal: true,
    envFilePath: '.env',
  };
}
