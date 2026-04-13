import { IPatientDocument } from '../../models/Patient';

export interface CreatePatientBody {
    fullName: string;
    age: number;
    address: string;
    phoneNumber: string;
    pharmacistName: string;
    prescriptions?: string[];
    appointmentDates?: string[];
    notes?: string;
    customFields?: Record<string, unknown>;
}

export interface UpdatePatientBody {
    fullName?: string;
    age?: number;
    address?: string;
    phoneNumber?: string;
    prescriptions?: string[];
    appointmentDates?: string[];
    notes?: string;
    customFields?: Record<string, unknown>;
}

export interface ListPatientsQuery {
    page?: number;
    limit?: number;
    search?: string;
}

export interface PaginatedPatientsResult {
    patients: IPatientDocument[];
    total: number;
    page: number;
    limit: number;
}
