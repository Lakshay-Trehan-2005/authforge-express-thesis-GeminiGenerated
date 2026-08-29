import mongoose, { Document, Model, Schema, Types } from 'mongoose';

// ─── Interface ───────────────────────────────────────────────────────────────

export interface ISession {
  userId: Types.ObjectId;
  refreshToken: string;
  userAgent?: string;
  ipAddress?: string;
  isValid: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISessionDocument extends ISession, Document {}

export interface ISessionModel extends Model<ISessionDocument> {
  findValidSession(sessionId: string): Promise<ISessionDocument | null>;
}

// ─── Schema ──────────────────────────────────────────────────────────────────

const sessionSchema = new Schema<ISessionDocument, ISessionModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    refreshToken: {
      type: String,
      required: true,
      // Tokens are long strings; index for O(1) lookup during refresh/logout
      index: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    isValid: {
      type: Boolean,
      default: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      // TTL index — MongoDB auto-deletes expired session documents
      index: { expires: 0 },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        delete ret['__v'];
        return ret;
      },
    },
  }
);

// ─── Static: Find Valid Session ───────────────────────────────────────────────

sessionSchema.statics.findValidSession = function (
  this: ISessionModel,
  sessionId: string
): Promise<ISessionDocument | null> {
  return this.findOne({
    _id: sessionId,
    isValid: true,
    expiresAt: { $gt: new Date() },
  }).exec();
};

// ─── Export ───────────────────────────────────────────────────────────────────

export const Session = mongoose.model<ISessionDocument, ISessionModel>(
  'Session',
  sessionSchema
);
