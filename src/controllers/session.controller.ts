import { Request, Response, NextFunction } from 'express';
import * as sessionService from '../services/session.service';

/**
 * POST /api/sessions
 * Login: validate credentials, create a DB-backed session,
 * and return an access token + refresh token pair.
 */
export async function createSession(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const result = await sessionService.createSession({
      email,
      password,
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      message: 'Login successful',
      data: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        sessionId: result.sessionId,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/sessions
 * Return all active sessions for the currently authenticated user.
 */
export async function getMySessions(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.sub;
    const sessions = await sessionService.getUserSessions(userId);

    res.status(200).json({
      success: true,
      data: { count: sessions.length, sessions },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/sessions/:id
 * Invalidate a specific session by ID (must belong to the requesting user).
 */
export async function invalidateSession(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await sessionService.invalidateSession(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Session invalidated successfully',
    });
  } catch (err) {
    next(err);
  }
}
