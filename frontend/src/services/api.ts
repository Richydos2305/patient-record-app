import axios from 'axios';
import type {
  User,
  Patient,
  CustomField,
  CreatePatientRequest,
  UpdatePatientRequest,
  UpdateUserRequest,
  LoginCredentials,
  RegisterData,
} from '../types';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const api = axios.create({ baseURL: BASE_URL });

// ── Request interceptor: attach access token ──────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: handle 401 / token refresh ─────────────────────────
let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

function clearAuthAndRedirect() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  window.location.href = '/login';
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/api/auth/')
    ) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshQueue.push((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${BASE_URL}/api/auth/refresh`, {
          token: refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = data.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        refreshQueue.forEach((cb) => cb(accessToken));
        refreshQueue = [];

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch {
        refreshQueue = [];
        clearAuthAndRedirect();
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// ── Helper to unwrap the standard response envelope ───────────────────────────
function unwrap<T>(promise: Promise<{ data: { data: T } }>): Promise<T> {
  return promise.then((res) => res.data.data);
}

// ── Auth API ──────────────────────────────────────────────────────────────────
export const authApi = {
  register(data: Pick<RegisterData, 'email' | 'password' | 'fullName'>) {
    return unwrap<{ accessToken: string; refreshToken: string; user: User }>(
      api.post('/api/auth/register', data),
    );
  },

  login(data: LoginCredentials) {
    return unwrap<{ accessToken: string; refreshToken: string; user: User }>(
      api.post('/api/auth/login', data),
    );
  },

  logout(refreshToken: string) {
    return api.post('/api/auth/logout', { token: refreshToken });
  },

  refresh(token: string) {
    return unwrap<{ accessToken: string; refreshToken: string }>(
      api.post('/api/auth/refresh', { token }),
    );
  },

  getProfile() {
    return unwrap<User>(api.get('/api/users/profile'));
  },

  updateProfile(data: UpdateUserRequest) {
    return unwrap<User>(api.put('/api/users/profile', data));
  },
};

// ── Patient API ───────────────────────────────────────────────────────────────
export const patientApi = {
  getPatients(params?: { page?: number; limit?: number; search?: string }) {
    return unwrap<{ patients: Patient[]; total: number; page: number; limit: number }>(
      api.get('/api/patients', { params }),
    );
  },

  getPatient(id: string) {
    return unwrap<Patient>(api.get(`/api/patients/${id}`));
  },

  createPatient(data: CreatePatientRequest) {
    return unwrap<Patient>(api.post('/api/patients', data));
  },

  updatePatient(id: string, data: Omit<UpdatePatientRequest, 'id'>) {
    return unwrap<Patient>(api.put(`/api/patients/${id}`, data));
  },

  deletePatient(id: string) {
    return api.delete(`/api/patients/${id}`);
  },
};

// ── Custom Field API ──────────────────────────────────────────────────────────
export const customFieldApi = {
  getCustomFields() {
    return unwrap<CustomField[]>(api.get('/api/custom-fields'));
  },

  createCustomField(data: Omit<CustomField, 'id'>) {
    return unwrap<CustomField>(api.post('/api/custom-fields', data));
  },

  updateCustomField(id: string, data: Partial<Omit<CustomField, 'id'>>) {
    return unwrap<CustomField>(api.put(`/api/custom-fields/${id}`, data));
  },

  deleteCustomField(id: string) {
    return api.delete(`/api/custom-fields/${id}`);
  },
};

// ── File API ─────────────────────────────────────────────────────────────────
export const fileApi = {
  uploadFile(patientId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return unwrap<unknown>(
      api.post(`/api/files/upload/${patientId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    );
  },

  getPatientFiles(patientId: string) {
    return unwrap<unknown[]>(api.get(`/api/files/patient/${patientId}`));
  },

  deleteFile(filename: string) {
    return api.delete(`/api/files/${filename}`);
  },
};
