import { Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../models/User.model';
import { Session, ISessionDocument } from '../models/Session.model';
import { signAccessToken, signRefreshToken } from '../utils/jwt';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';

export interface LoginInput {
  email: string;
  password: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface SessionResult extends TokenPair {
  sessionId: string;
}

// Parse a JWT expiresIn string (e.g. "7d", "15m") to milliseconds
function parseDurationMs(duration: string): number {
  const match = /^(\d+)([smhd])$/.exec(duration);
  if (!match) throw new Error(`Invalid duration format: ${duration}`);
  const value = parseInt(match[1], 10);
  const unit = match[2];
  const map: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  return value * map[unit];
}

// ─── Create Session (Login) ───────────────────────────────────────────────────

export async function createSession(input: LoginInput): Promise<SessionResult> {
  // 1. Validate credentials
  const user = await User.findByEmail(input.email);
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  if (!user.isActive) {
    throw ApiError.forbidden('Your account has been deactivated');
  }

  const passwordMatch = await user.comparePassword(input.password);
  if (!passwordMatch) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  // 2. Build token payloads
  const userId = (user._id as Types.ObjectId).toString();
  const sessionId = uuidv4();

  const accessToken = signAccessToken({
    sub: userId,
    email: user.email,
    role: user.role,
  });

  const refreshToken = signRefreshToken({
    sub: userId,
    sessionId,
  });

  // 3. Persist session
  const expiresAt = new Date(
    Date.now() + parseDurationMs(env.jwt.refreshExpiresIn)
  );

  await Session.create({
    _id: sessionId,
    userId: user._id,
    refreshToken,
    userAgent: input.userAgent,
    ipAddress: input.ipAddress,
    isValid: true,
    expiresAt,
  });

  return { accessToken, refreshToken, sessionId };
}

// ─── Get Active Sessions for User ────────────────────────────────────────────

export async function getUserSessions(userId: string): Promise<ISessionDocument[]> {
  return Session.find({
    userId: new Types.ObjectId(userId),
    isValid: true,
    expiresAt: { $gt: new Date() },
  })
    .sort({ createdAt: -1 })
    .exec();
}

// ─── Invalidate Single Session ────────────────────────────────────────────────

export async function invalidateSession(sessionId: string): Promise<void> {
  const result = await Session.findByIdAndUpdate(sessionId, { isValid: false });
  if (!result) {
    throw ApiError.notFound('Session not found');
  }
}

// ─── Invalidate All Sessions for User ────────────────────────────────────────

export async function invalidateAllUserSessions(userId: string): Promise<void> {
  await Session.updateMany(
    { userId: new Types.ObjectId(userId), isValid: true },
    { isValid: false }
  );
}
