export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
}

export interface CreatePatientPayload {
  name: string;
  dob?: string;
  address?: string;
  phone?: string;
  emergencyContact?: string;
  prescriptions?: string[];
  appointmentDates?: string[];
  notes?: string;
  customValues?: { fieldId: string; value: string | number | boolean }[];
}

export interface UpdatePatientPayload {
  name?: string;
  dob?: string;
  address?: string;
  phone?: string;
  emergencyContact?: string;
  prescriptions?: string[];
  appointmentDates?: string[];
  notes?: string;
  customValues?: { fieldId: string; value: string | number | boolean }[];
}

export interface CreateCustomFieldPayload {
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'file';
  description?: string;
  required?: boolean;
}

export interface UpdateCustomFieldPayload {
  name?: string;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'file';
  description?: string;
  required?: boolean;
}

export interface GetPatientsQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
}
