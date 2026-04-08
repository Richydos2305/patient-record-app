import { IPrescription } from '../../interfaces/models';
import { IPatientDocument } from '../../models/Patient';

export interface CreatePatientBody {
    fullName: string;
    age: number;
    address: string;
    phoneNumber: string;
    pharmacistName: string;
    prescriptions?: IPrescription[];
    appointmentDates?: string[];
    notes?: string;
    customFields?: Record<string, unknown>;
}

export interface UpdatePatientBody {
    fullName?: string;
    age?: number;
    address?: string;
    phoneNumber?: string;
    prescriptions?: IPrescription[];
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
