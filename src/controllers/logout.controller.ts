import { Request, Response, NextFunction } from 'express';
import sessionService from '../services/session.service';
import ApiError from '../utils/ApiError';

export class LogoutController {
  /**
   * Logout user handler - invalidates the session in database
   */
  public logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new ApiError(400, 'Refresh token is required to log out');
      }

      await sessionService.invalidateSession(refreshToken);

      res.status(200).json({
        success: true,
        message: 'Logged out successfully, session invalidated',
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new LogoutController();
