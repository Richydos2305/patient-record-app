import { IEmergencyContact, IPrescription } from '../../interfaces/models';
import { IPatientDocument } from '../../models/Patient';

export interface CreatePatientBody {
    fullName: string;
    dateOfBirth: string;
    address: string;
    phoneNumber: string;
    emergencyContact: IEmergencyContact;
    prescriptions?: IPrescription[];
    appointmentDates?: string[];
    notes?: string;
    customFields?: Record<string, unknown>;
}

export interface UpdatePatientBody {
    fullName?: string;
    dateOfBirth?: string;
    address?: string;
    phoneNumber?: string;
    emergencyContact?: Partial<IEmergencyContact>;
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
