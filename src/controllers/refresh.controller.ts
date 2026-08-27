import { Request, Response, NextFunction } from 'express';
import refreshService from '../services/refresh.service';

export class RefreshController {
  /**
   * Refresh token handler
   */
  public refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      const result = await refreshService.refreshAccessToken(refreshToken);

      res.status(200).json({
        success: true,
        message: 'Access token refreshed successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new RefreshController();
