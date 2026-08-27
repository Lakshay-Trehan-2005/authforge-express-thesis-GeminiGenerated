import { Request, Response, NextFunction } from 'express';
import userService from '../services/user.service';

export class UserController {
  /**
   * Register user handler
   */
  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password, role } = req.body;
      const user = await userService.createUser({ email, password, role });
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new UserController();
