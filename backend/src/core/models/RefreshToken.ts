import { Schema, model, Document, Types } from 'mongoose';
import { IRefreshToken } from '../interfaces/models';

export interface RefreshTokenDocument extends IRefreshToken, Document {}

const refreshTokenSchema = new Schema<RefreshTokenDocument>(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User'
    },
    token: {
      type: String,
      required: true,
      unique: true
    },
    expiresAt: {
      type: Date,
      required: true
    },
    isRevoked: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  { timestamps: true }
);

refreshTokenSchema.index({ userId: 1 });

export const RefreshToken = model<RefreshTokenDocument>('RefreshToken', refreshTokenSchema);
