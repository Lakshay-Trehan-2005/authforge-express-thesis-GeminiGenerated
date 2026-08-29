import { User, IUserDocument } from '../models/User.model';
import { ApiError } from '../utils/ApiError';

export interface RegisterInput {
  email: string;
  password: string;
  role?: 'user' | 'admin';
}

export interface PublicUser {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

function toPublicUser(doc: IUserDocument): PublicUser {
  return {
    id: (doc._id as { toString(): string }).toString(),
    email: doc.email,
    role: doc.role,
    isActive: doc.isActive,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

// ─── Register ────────────────────────────────────────────────────────────────

export async function registerUser(input: RegisterInput): Promise<PublicUser> {
  const existing = await User.findOne({ email: input.email.toLowerCase().trim() });
  if (existing) {
    throw ApiError.conflict('An account with this email already exists');
  }

  const user = new User({
    email: input.email,
    password: input.password,
    role: input.role ?? 'user',
  });

  await user.save();
  return toPublicUser(user);
}

// ─── Get All Users (Admin) ────────────────────────────────────────────────────

export async function getAllUsers(): Promise<PublicUser[]> {
  const users = await User.find({}).sort({ createdAt: -1 }).lean<IUserDocument[]>();
  // lean() returns plain objects, so cast manually
  return users.map((u) => ({
    id: (u._id as { toString(): string }).toString(),
    email: u.email,
    role: u.role,
    isActive: u.isActive,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  }));
}

// ─── Get User By ID ───────────────────────────────────────────────────────────

export async function getUserById(userId: string): Promise<PublicUser> {
  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound('User not found');
  }
  return toPublicUser(user);
}

// ─── Deactivate / Delete User ─────────────────────────────────────────────────

export async function deactivateUser(userId: string): Promise<void> {
  const result = await User.findByIdAndUpdate(userId, { isActive: false });
  if (!result) {
    throw ApiError.notFound('User not found');
  }
}
