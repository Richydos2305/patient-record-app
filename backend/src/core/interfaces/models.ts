import { Types } from 'mongoose';

export interface IUser {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
}

export interface IRefreshToken {
    token: string;
    userId: Types.ObjectId;
    expiresAt: Date;
    isRevoked: boolean;
}

export interface ICustomField {
    name: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'boolean' | 'file';
    required: boolean;
    description: string;
}

export interface IEmergencyContact {
    name: string;
    phone: string;
    relationship: string;
}

export interface IFile {
    originalName: string;
    cloudinaryId: string;
    url: string;
    mimetype: string;
    size: number;
    patientId: Types.ObjectId;
}

export interface IPatient {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    address: string;
    phone: string;
    emergencyContact: IEmergencyContact;
    prescriptions: string[];
    appointmentDates: Date[];
    notes: string;
    customFields: Record<string, unknown>;
}
