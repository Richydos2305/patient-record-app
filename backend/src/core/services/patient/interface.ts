import { IEmergencyContact } from '../../interfaces/models';

export interface CreatePatientBody {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    address: string;
    phone: string;
    emergencyContact: IEmergencyContact;
    prescriptions?: string[];
    appointmentDates?: string[];
    notes?: string;
    customFields?: Record<string, unknown>;
}

export interface UpdatePatientBody {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    address?: string;
    phone?: string;
    emergencyContact?: Partial<IEmergencyContact>;
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
