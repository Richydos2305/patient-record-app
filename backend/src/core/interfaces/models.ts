import { Types } from 'mongoose';

export interface IUser {
    email: string;
    password: string;
    fullName: string;
    role: string;
    phoneNumber?: string;
    companyName?: string;
    companyLogo?: string;
    primaryColor?: string;
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
    type: 'text' | 'textarea' | 'number' | 'date' | 'boolean' | 'file' | 'dropdown';
    required: boolean;
    description: string;
    options?: string[];
}

export interface IPrescription {
    medicationName: string;
    dosage: string;
    frequency: string;
    prescriptionDate: string;
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
    userId: Types.ObjectId;
    fullName: string;
    dateOfBirth: Date;
    address: string;
    phoneNumber: string;
    prescriptions: IPrescription[];
    appointmentDates: Date[];
    notes: string;
    customFields: Record<string, unknown>;
}
