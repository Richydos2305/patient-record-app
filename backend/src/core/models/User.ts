import { Schema, model, HydratedDocument } from 'mongoose';
import { IUser } from '../interfaces/models';

export type { IUser };

const userSchema = new Schema<IUser>(
    {
        email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
        password:  { type: String, required: true },
        firstName: { type: String, required: true, trim: true },
        lastName:  { type: String, required: true, trim: true },
        role:      { type: String, default: 'pharmacist' },
    },
    { timestamps: true },
);

export type IUserDocument = HydratedDocument<IUser>;
export const UserModel = model<IUser>('User', userSchema);
