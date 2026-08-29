import { Request, Response, NextFunction } from 'express';
import { verifyRefreshToken } from '../utils/jwt';
import {
  invalidateSession,
  invalidateAllUserSessions,
} from '../services/session.service';
import { ApiError } from '../utils/ApiError';

/**
 * POST /api/logout
 * Invalidate the current session identified by the provided refresh token.
 * The session record is marked as invalid in the database, preventing
 * further use of the refresh token.
 */
export async function logout(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { refreshToken } = req.body as { refreshToken: string };

    // Decode the refresh token to extract the session ID.
    // We still validate the token signature to prevent arbitrary session
    // invalidation attacks, even though the token may be about to expire.
    let sessionId: string;
    try {
      const payload = verifyRefreshToken(refreshToken);
      sessionId = payload.sessionId;
    } catch {
      // If the token is already expired/invalid, consider the user
      // effectively logged out — return 200 gracefully.
      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
      return;
    }

    await invalidateSession(sessionId);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/logout/all  (requires authentication)
 * Invalidate ALL active sessions for the authenticated user.
 * Useful when a user suspects their account has been compromised.
 */
export async function logoutAll(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      return next(ApiError.unauthorized());
    }

    await invalidateAllUserSessions(req.user.sub);

    res.status(200).json({
      success: true,
      message: 'All sessions invalidated successfully',
    });
  } catch (err) {
    next(err);
  }
}
