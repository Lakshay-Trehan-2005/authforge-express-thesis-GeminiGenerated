import { Types } from 'mongoose';
import { Session } from '../models/Session.model';
import { User } from '../models/User.model';
import {
  verifyRefreshToken,
  signAccessToken,
  RefreshTokenPayload,
} from '../utils/jwt';
import { ApiError } from '../utils/ApiError';

export interface RefreshResult {
  accessToken: string;
}

// ─── Refresh Access Token ─────────────────────────────────────────────────────

export async function refreshAccessToken(incomingRefreshToken: string): Promise<RefreshResult> {
  // 1. Verify the token signature and expiry
  let payload: RefreshTokenPayload;
  try {
    payload = verifyRefreshToken(incomingRefreshToken);
  } catch {
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }

  const { sub: userId, sessionId } = payload;

  // 2. Look up the session in the database
  const session = await Session.findOne({
    _id: sessionId,
    refreshToken: incomingRefreshToken,
    isValid: true,
    expiresAt: { $gt: new Date() },
  });

  if (!session) {
    throw ApiError.unauthorized(
      'Session not found or has been revoked. Please log in again.'
    );
  }

  // 3. Ensure the owning user still exists and is active
  const user = await User.findById(new Types.ObjectId(userId));
  if (!user || !user.isActive) {
    // Revoke the session for a compromised / deactivated account
    await Session.findByIdAndUpdate(sessionId, { isValid: false });
    throw ApiError.unauthorized('User account is inactive or no longer exists');
  }

  // 4. Issue a new access token (refresh token itself is not rotated here,
  //    but rotation can be added by invalidating the old session and
  //    creating a new one in session.service.createSession)
  const accessToken = signAccessToken({
    sub: userId,
    email: user.email,
    role: user.role,
  });

  return { accessToken };
}
