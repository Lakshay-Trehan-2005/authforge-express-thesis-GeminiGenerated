import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { env } from '../config/env';

// ─── Role Enum ───────────────────────────────────────────────────────────────

export type UserRole = 'user' | 'admin';

// ─── Interface ───────────────────────────────────────────────────────────────

export interface IUser {
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUserDocument> {
  findByEmail(email: string): Promise<IUserDocument | null>;
}

// ─── Schema ──────────────────────────────────────────────────────────────────

const userSchema = new Schema<IUserDocument, IUserModel>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // never returned by default in queries
    },
    role: {
      type: String,
      enum: ['user', 'admin'] as UserRole[],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        delete ret['password'];
        delete ret['__v'];
        return ret;
      },
    },
  }
);

// ─── Pre-save: Hash Password ──────────────────────────────────────────────────

userSchema.pre('save', async function (this: IUserDocument) {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(env.bcrypt.saltRounds);
  this.password = await bcrypt.hash(this.password, salt);
});

// ─── Instance Method: Compare Password ───────────────────────────────────────

userSchema.methods.comparePassword = async function (
  this: IUserDocument,
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// ─── Static Method: Find By Email ────────────────────────────────────────────

userSchema.statics.findByEmail = function (
  this: IUserModel,
  email: string
): Promise<IUserDocument | null> {
  return this.findOne({ email: email.toLowerCase().trim() }).select('+password').exec();
};

// ─── Export ───────────────────────────────────────────────────────────────────

export const User = mongoose.model<IUserDocument, IUserModel>('User', userSchema);
