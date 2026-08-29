import dotenv from 'dotenv';
import path from 'path';

// Load .env file from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function optionalEnv(key: string, defaultValue: string): string {
  return process.env[key] ?? defaultValue;
}

export const env = {
  port: parseInt(optionalEnv('PORT', '3000'), 10),
  nodeEnv: optionalEnv('NODE_ENV', 'development'),
  isProduction: optionalEnv('NODE_ENV', 'development') === 'production',

  mongo: {
    uri: requireEnv('MONGO_URI'),
  },

  jwt: {
    accessSecret: requireEnv('JWT_ACCESS_SECRET'),
    refreshSecret: requireEnv('JWT_REFRESH_SECRET'),
    accessExpiresIn: optionalEnv('JWT_ACCESS_EXPIRES_IN', '15m'),
    refreshExpiresIn: optionalEnv('JWT_REFRESH_EXPIRES_IN', '7d'),
  },

  rateLimit: {
    windowMs: parseInt(optionalEnv('RATE_LIMIT_WINDOW_MS', '900000'), 10), // 15 min
    max: parseInt(optionalEnv('RATE_LIMIT_MAX', '100'), 10),
  },

  cors: {
    origin: optionalEnv('CORS_ORIGIN', 'http://localhost:5173'),
  },

  bcrypt: {
    saltRounds: parseInt(optionalEnv('BCRYPT_SALT_ROUNDS', '12'), 10),
  },
} as const;
