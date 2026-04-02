// User and Authentication Types
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  // Business branding (optional)
  companyName?: string;
  companyLogo?: string;
  phoneNumber?: string;
  primaryColor?: string;
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
  phoneNumber?: string;
  companyName?: string;
  companyLogo?: string;
  primaryColor?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Patient Types
export interface Patient {
  id: string;
  fullName: string;
  dateOfBirth: string;
  address: string;
  phoneNumber: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  prescriptions: Prescription[];
  appointmentDates: string[];
  notes?: string;
  customFields: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Prescription {
  id: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  prescriptionDate: string;
}

// Custom Field Types
export type CustomFieldType = 'text' | 'textarea' | 'number' | 'date' | 'boolean' | 'file' | 'dropdown';

export interface CustomField {
  id: string;
  name: string;
  label: string;
  type: CustomFieldType;
  required: boolean;
  description: string;
  options?: string[];
}

export interface CustomFieldValue {
  fieldId: string;
  field: CustomField;
  value: string | number | boolean | File | File[];
}

// API Request/Response Types
export interface CreatePatientRequest {
  fullName: string;
  dateOfBirth: string;
  address: string;
  phoneNumber: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  prescriptions: Omit<Prescription, 'id'>[];
  appointmentDates: string[];
  notes?: string;
  customFields: Record<string, unknown>;
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
