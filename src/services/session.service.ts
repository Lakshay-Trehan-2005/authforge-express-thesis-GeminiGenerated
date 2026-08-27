import Session, { ISessionDocument } from '../models/Session.model';
import userService from './user.service';
import { signAccessToken, signRefreshToken } from '../utils/jwt';
import ApiError from '../utils/ApiError';
import env from '../config/env';
import { Types } from 'mongoose';

export class SessionService {
  /**
   * Parse simple duration strings like "7d", "15m", "1h" to milliseconds
   */
  private parseDuration(duration: string): number {
    const match = duration.match(/^(\d+)([dhm])$/);
    if (!match) return 7 * 24 * 60 * 60 * 1000; // default 7 days
    const value = parseInt(match[1], 10);
    const unit = match[2];
    switch (unit) {
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'm':
        return value * 60 * 1000;
      default:
        return 7 * 24 * 60 * 60 * 1000;
    }
  }

  /**
   * Create a new session (login) and return access/refresh tokens
   */
  public async createSession(
    email: string,
    passwordCandidate: string,
    ip?: string,
    userAgent?: string
  ): Promise<{ accessToken: string; refreshToken: string; user: { id: string; email: string; role: 'user' | 'admin' } }> {
    const user = await userService.getUserByEmail(email, true);

    if (!user || !(await user.comparePassword(passwordCandidate))) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const userPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = signAccessToken(userPayload);
    const refreshToken = signRefreshToken(userPayload);

    // Save refresh token to MongoDB Session tracking
    const refreshExpMs = this.parseDuration(env.JWT_REFRESH_EXPIRATION);
    const expiresAt = new Date(Date.now() + refreshExpMs);

    await Session.create({
      userId: user._id as Types.ObjectId,
      token: refreshToken,
      expiresAt,
      ip,
      userAgent,
    });

    return {
      accessToken,
      refreshToken,
      user: userPayload,
    };
  }

  /**
   * Invalidate a session (logout) by deleting the token
   */
  public async invalidateSession(token: string): Promise<void> {
    const deletedSession = await Session.findOneAndDelete({ token });
    if (!deletedSession) {
      throw new ApiError(404, 'Session not found or already invalidated');
    }
  }
}

export default new SessionService();
