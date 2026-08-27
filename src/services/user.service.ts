import User, { IUser, IUserDocument } from '../models/User.model';
import ApiError from '../utils/ApiError';

export class UserService {
  /**
   * Register a new user
   */
  public async createUser(userData: IUser): Promise<IUserDocument> {
    const existingUser = await User.findOne({ email: userData.email.toLowerCase() });
    
    if (existingUser) {
      throw new ApiError(409, 'User with this email already exists');
    }

    const newUser = new User({
      email: userData.email,
      password: userData.password,
      role: userData.role,
    });

    await newUser.save();
    
    // Remove password before returning
    newUser.password = undefined;
    return newUser;
  }

  /**
   * Find user by email (optionally include password)
   */
  public async getUserByEmail(email: string, includePassword = false): Promise<IUserDocument | null> {
    const query = User.findOne({ email: email.toLowerCase() });
    if (includePassword) {
      query.select('+password');
    }
    return query.exec();
  }

  /**
   * Find user by id
   */
  public async getUserById(id: string): Promise<IUserDocument | null> {
    return User.findById(id).exec();
  }
}

export default new UserService();
