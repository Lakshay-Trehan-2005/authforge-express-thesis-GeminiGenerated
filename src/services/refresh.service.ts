import Session from '../models/Session.model';
import userService from './user.service';
import { verifyRefreshToken, signAccessToken } from '../utils/jwt';
import ApiError from '../utils/ApiError';

export class RefreshService {
  /**
   * Validate refresh token and issue a new short-lived access token
   */
  public async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    // 1. Verify the signature and expiration of the refresh token
    const payload = verifyRefreshToken(refreshToken);

    // 2. Ensure session exists in the database
    const activeSession = await Session.findOne({ token: refreshToken });
    if (!activeSession) {
      throw new ApiError(401, 'Unauthorized: Session is invalid or has expired');
    }

    // 3. Confirm user still exists
    const user = await userService.getUserById(payload.id);
    if (!user) {
      throw new ApiError(401, 'Unauthorized: User belonging to this token no longer exists');
    }

    // 4. Generate new access token
    const newAccessToken = signAccessToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return {
      accessToken: newAccessToken,
    };
  }
}

export default new RefreshService();
