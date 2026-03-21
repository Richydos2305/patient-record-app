import type { User, LoginCredentials, RegisterData, AuthResponse, Patient, CreatePatientRequest, UpdatePatientRequest, UpdateUserRequest } from '../types';

// Mock database
let users: User[] = [];
let patients: Patient[] = [];

// Helper to simulate API delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Generate unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// Mock Authentication API
export const authApi = {
  async register(data: RegisterData): Promise<AuthResponse> {
    await delay();
    
    // Check if user already exists
    if (users.find(u => u.email === data.email)) {
      throw new Error('User with this email already exists');
    }
    
    const user: User = {
      id: generateId(),
      email: data.email,
      fullName: data.fullName,
      role: 'pharmacist',
      createdAt: new Date().toISOString(),
    };
    
    users.push(user);
    const token = `mock-token-${generateId()}`;
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { user, token };
  },
  
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay();
    
    const user = users.find(u => u.email === credentials.email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    const token = `mock-token-${generateId()}`;
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { user, token };
  },
  
  async logout(): Promise<void> {
    await delay(200);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },
  
  async getCurrentUser(): Promise<User | null> {
    await delay(200);
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      return null;
    }
    
    return JSON.parse(userStr);
  },

  async updateUser(data: UpdateUserRequest): Promise<User> {
    await delay();
    
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      throw new Error('Unauthorized');
    }
    
    const currentUser: User = JSON.parse(userStr);
    
    // Update user in memory array
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...data };
    }
    
    // Update current user object
    const updatedUser: User = {
      ...currentUser,
      ...data,
    };
    
    // Persist to localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return updatedUser;
  },
};

// Mock Patient API
export const patientApi = {
  async getPatients(): Promise<Patient[]> {
    await delay();
    return [...patients];
  },
  
  async getPatient(id: string): Promise<Patient | null> {
    await delay();
    return patients.find(p => p.id === id) || null;
  },
  
  async createPatient(data: CreatePatientRequest): Promise<Patient> {
    await delay();
    
    const user = await authApi.getCurrentUser();
    if (!user) {
      throw new Error('Unauthorized');
    }
    
    const patient: Patient = {
      id: generateId(),
      ...data,
      currentPrescriptions: data.currentPrescriptions.map(p => ({
        ...p,
        id: generateId(),
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user.id,
    };
    
    patients.push(patient);
    return patient;
  },
  
  async updatePatient(data: UpdatePatientRequest): Promise<Patient> {
    await delay();
    
    const index = patients.findIndex(p => p.id === data.id);
    if (index === -1) {
      throw new Error('Patient not found');
    }
    
    const updatedPatient: Patient = {
      ...patients[index],
      ...data,
      currentPrescriptions: data.currentPrescriptions 
        ? data.currentPrescriptions.map(p => ({
            ...p,
            id: ('id' in p ? (p as any).id : generateId()) as string,
          }))
        : patients[index].currentPrescriptions,
      updatedAt: new Date().toISOString(),
    };
    
    patients[index] = updatedPatient;
    return updatedPatient;
  },
  
  async deletePatient(id: string): Promise<void> {
    await delay();
    patients = patients.filter(p => p.id !== id);
  },
};

// Initialize with sample data
export const initializeMockData = () => {
  // Add sample user
  if (users.length === 0) {
    users.push({
      id: 'user-1',
      email: 'pharmacist@example.com',
      fullName: 'Dr. Sarah Johnson',
      role: 'pharmacist',
      createdAt: new Date().toISOString(),
    });
  }
  
  // Add sample patients
  if (patients.length === 0) {
    patients.push(
      {
        id: 'patient-1',
        fullName: 'John Doe',
        dateOfBirth: '1985-03-15',
        houseAddress: '123 Main St, Anytown, ST 12345',
        phoneNumber: '(555) 123-4567',
        emergencyContact: 'Jane Doe - (555) 987-6543',
        currentPrescriptions: [
          {
            id: 'rx-1',
            medicationName: 'Lisinopril',
            dosage: '10mg',
            frequency: 'Once daily',
            prescriptionDate: '2026-01-15',
          },
        ],
        nextAppointmentDate: '2026-03-15',
        pharmacistNotes: 'Patient is responding well to current medication.',
        customFields: [],
        createdAt: '2026-01-15T10:00:00Z',
        updatedAt: '2026-01-15T10:00:00Z',
        createdBy: 'user-1',
      },
      {
        id: 'patient-2',
        fullName: 'Mary Smith',
        dateOfBirth: '1972-07-22',
        houseAddress: '456 Oak Ave, Springfield, ST 67890',
        phoneNumber: '(555) 234-5678',
        emergencyContact: 'Robert Smith - (555) 876-5432',
        currentPrescriptions: [
          {
            id: 'rx-2',
            medicationName: 'Metformin',
            dosage: '500mg',
            frequency: 'Twice daily',
            prescriptionDate: '2026-01-10',
          },
          {
            id: 'rx-3',
            medicationName: 'Atorvastatin',
            dosage: '20mg',
            frequency: 'Once daily at bedtime',
            prescriptionDate: '2026-01-10',
          },
        ],
        nextAppointmentDate: '2026-02-20',
        pharmacistNotes: 'Monitor blood sugar levels. Patient reports no side effects.',
        customFields: [],
        createdAt: '2026-01-10T14:30:00Z',
        updatedAt: '2026-02-01T09:15:00Z',
        createdBy: 'user-1',
      },
    );
  }
};
