import { Request, Response, NextFunction } from 'express';
import { refreshAccessToken } from '../services/refresh.service';

/**
 * POST /api/token
 * Accept a valid refresh token and return a new short-lived access token.
 */
export async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { refreshToken: incomingToken } = req.body as { refreshToken: string };

    const result = await refreshAccessToken(incomingToken);

    res.status(200).json({
      success: true,
      message: 'Access token refreshed',
      data: {
        accessToken: result.accessToken,
      },
    });
  } catch (err) {
    next(err);
  }
}
