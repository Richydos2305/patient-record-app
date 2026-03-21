import { Schema, model, Document } from 'mongoose';
import { IUser } from '../interfaces/models';

export interface UserDocument extends IUser, Document {}

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export const User = model<UserDocument>('User', userSchema);
