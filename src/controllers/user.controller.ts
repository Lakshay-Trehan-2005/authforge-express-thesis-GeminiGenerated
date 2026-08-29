import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';

/**
 * POST /api/users
 * Register a new user account.
 */
export async function registerUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password, role } = req.body as {
      email: string;
      password: string;
      role?: 'user' | 'admin';
    };

    const user = await userService.registerUser({ email, password, role });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { user },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/users/me
 * Return the currently authenticated user's profile.
 */
export async function getMe(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.sub;
    const user = await userService.getUserById(userId);

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/users  (admin only)
 * Return all user accounts.
 */
export async function getAllUsers(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const users = await userService.getAllUsers();

    res.status(200).json({
      success: true,
      data: { count: users.length, users },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/users/:id  (admin only)
 * Deactivate a user account.
 */
export async function deactivateUser(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await userService.deactivateUser(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully',
    });
  } catch (err) {
    next(err);
  }
}
