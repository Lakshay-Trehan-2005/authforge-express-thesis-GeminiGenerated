import jwt from 'jsonwebtoken';
import env from '../config/env';
import ApiError from './ApiError';

export interface UserPayload {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

/**
 * Sign a short-lived access token
 */
export const signAccessToken = (payload: UserPayload): string => {
  return jwt.sign({ ...payload }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRATION as any,
  });
};

/**
 * Sign a long-lived refresh token
 */
export const signRefreshToken = (payload: UserPayload): string => {
  return jwt.sign({ ...payload }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRATION as any,
  });
};

/**
 * Verify access token and return its payload
 */
export const verifyAccessToken = (token: string): UserPayload => {
  try {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as UserPayload;
  } catch (error) {
    throw new ApiError(401, 'Unauthorized: Invalid or expired access token');
  }
};

/**
 * Verify refresh token and return its payload
 */
export const verifyRefreshToken = (token: string): UserPayload => {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as UserPayload;
  } catch (error) {
    throw new ApiError(401, 'Unauthorized: Invalid or expired refresh token');
  }
};
