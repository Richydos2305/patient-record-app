import { PatientRepository } from '../../repositories/PatientRepository';
import { validateCreatePatientPayload, validateUpdatePatientPayload } from '../../helpers/validation';
import { NotFoundError } from '../../errors/CustomErrors';
import { IPatientDocument } from '../../models/Patient';
import { CreatePatientBody, UpdatePatientBody, ListPatientsQuery } from './interface';

export class PatientService {
    constructor(private readonly patientRepo: PatientRepository) {}

    async list(query: ListPatientsQuery): Promise<IPatientDocument[]> {
        const filter = query.search
            ? { $text: { $search: query.search } }
            : {};
        return this.patientRepo.find(filter);
    }

    async getById(id: string): Promise<IPatientDocument> {
        const patient = await this.patientRepo.findOne({ _id: id });
        if (!patient) throw new NotFoundError('Patient not found');
        return patient;
    }

    async create(body: CreatePatientBody): Promise<IPatientDocument> {
        validateCreatePatientPayload(body);
        return this.patientRepo.create({
            ...body,
            dateOfBirth: new Date(body.dateOfBirth),
            appointmentDates: body.appointmentDates?.map((d) => new Date(d)),
        });
    }

    async update(id: string, body: UpdatePatientBody): Promise<IPatientDocument> {
        validateUpdatePatientPayload(body);
        const update = {
            ...body,
            ...(body.dateOfBirth && { dateOfBirth: new Date(body.dateOfBirth) }),
            ...(body.appointmentDates && { appointmentDates: body.appointmentDates.map((d) => new Date(d)) }),
        };
        const patient = await this.patientRepo.updateOne(id, update, { new: true });
        if (!patient) throw new NotFoundError('Patient not found');
        return patient;
    }

    async delete(id: string): Promise<void> {
        const patient = await this.patientRepo.findOne({ _id: id });
        if (!patient) throw new NotFoundError('Patient not found');
        await this.patientRepo.deleteOne({ _id: id });
    }
}
