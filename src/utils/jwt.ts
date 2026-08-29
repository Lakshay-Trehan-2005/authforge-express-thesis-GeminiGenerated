import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import { env } from '../config/env';
import { ApiError } from './ApiError';

// ─── Payload Interfaces ──────────────────────────────────────────────────────

export interface AccessTokenPayload {
  sub: string;       // user ID
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  sub: string;       // user ID
  sessionId: string; // links token to a Session document
  iat?: number;
  exp?: number;
}

// ─── Access Token ────────────────────────────────────────────────────────────

export function signAccessToken(payload: Omit<AccessTokenPayload, 'iat' | 'exp'>): string {
  const options: SignOptions = {
    expiresIn: env.jwt.accessExpiresIn as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, env.jwt.accessSecret, options);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  try {
    const decoded = jwt.verify(token, env.jwt.accessSecret) as JwtPayload & AccessTokenPayload;
    return decoded;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw ApiError.unauthorized('Access token has expired');
    }
    if (err instanceof jwt.JsonWebTokenError) {
      throw ApiError.unauthorized('Invalid access token');
    }
    throw ApiError.unauthorized('Token verification failed');
  }
}

// ─── Refresh Token ───────────────────────────────────────────────────────────

export function signRefreshToken(payload: Omit<RefreshTokenPayload, 'iat' | 'exp'>): string {
  const options: SignOptions = {
    expiresIn: env.jwt.refreshExpiresIn as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, env.jwt.refreshSecret, options);
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  try {
    const decoded = jwt.verify(token, env.jwt.refreshSecret) as JwtPayload & RefreshTokenPayload;
    return decoded;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw ApiError.unauthorized('Refresh token has expired');
    }
    if (err instanceof jwt.JsonWebTokenError) {
      throw ApiError.unauthorized('Invalid refresh token');
    }
    throw ApiError.unauthorized('Refresh token verification failed');
  }
}

// ─── Extract Bearer Token ────────────────────────────────────────────────────

export function extractBearerToken(authorizationHeader: string | undefined): string {
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    throw ApiError.unauthorized('Authorization header missing or malformed');
  }
  return authorizationHeader.split(' ')[1];
}
