// User and Authentication Types
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'pharmacist';
  createdAt: string;
  // Business branding (optional)
  companyName?: string;
  companyLogo?: string; // base64 encoded image
  phoneNumber?: string;
  primaryColor?: string; // hex color code for theme
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  confirmPassword: string;
}

export interface UpdateUserRequest {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  companyName?: string;
  companyLogo?: string;
  primaryColor?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Patient Types
export interface Patient {
  id: string;
  fullName: string;
  dateOfBirth: string;
  houseAddress: string;
  phoneNumber: string;
  emergencyContact: string;
  currentPrescriptions: Prescription[];
  nextAppointmentDate: string;
  pharmacistNotes: string;
  customFields: CustomFieldValue[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Prescription {
  id: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  prescriptionDate: string;
}

// Custom Field Types
export type CustomFieldType = 'text' | 'textarea' | 'number' | 'date' | 'dropdown' | 'file';

export interface CustomField {
  id: string;
  label: string;
  type: CustomFieldType;
  required: boolean;
  section?: 'personal' | 'medical'; // Which section the field belongs to
  options?: string[]; // for dropdown type
  placeholder?: string;
}

export interface CustomFieldValue {
  fieldId: string;
  field: CustomField;
  value: string | number | File | File[];
}

// API Request/Response Types
export interface CreatePatientRequest {
  fullName: string;
  dateOfBirth: string;
  houseAddress: string;
  phoneNumber: string;
  emergencyContact: string;
  currentPrescriptions: Omit<Prescription, 'id'>[];
  nextAppointmentDate: string;
  pharmacistNotes: string;
  customFields: CustomFieldValue[];
}

export interface UpdatePatientRequest extends Partial<CreatePatientRequest> {
  id: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// UI State Types
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}
