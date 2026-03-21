export interface IUser {
  name: string;
  email: string;
  password: string;
}

export interface IRefreshToken {
  userId: string;
  token: string;
  expiresAt: Date;
  isRevoked: boolean;
}

export interface ICustomValue {
  fieldId: string;
  value: string | number | boolean | Date;
}

export interface IPatient {
  userId: string;
  name: string;
  dob?: Date;
  address?: string;
  phone?: string;
  emergencyContact?: string;
  prescriptions?: string[];
  appointmentDates?: Date[];
  notes?: string;
  customValues?: ICustomValue[];
}

export interface ICustomField {
  userId: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'file';
  description?: string;
  required: boolean;
}

export interface IFile {
  userId: string;
  patientId?: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
}
