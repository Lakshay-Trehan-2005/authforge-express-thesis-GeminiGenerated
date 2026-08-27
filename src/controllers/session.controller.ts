import { Request, Response, NextFunction } from 'express';
import sessionService from '../services/session.service';

export class SessionController {
  /**
   * Login user handler
   */
  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const ip = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const result = await sessionService.createSession(email, password, ip, userAgent);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new SessionController();
