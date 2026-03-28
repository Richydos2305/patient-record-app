import { Schema, model, HydratedDocument } from 'mongoose';
import { IPatient } from '../interfaces/models';

export type { IPatient };

const patientSchema = new Schema<IPatient>(
    {
        firstName:   { type: String, required: true, trim: true },
        lastName:    { type: String, required: true, trim: true },
        dateOfBirth: { type: Date, required: true },
        address:     { type: String, required: true, trim: true },
        phone:       { type: String, required: true, trim: true },
        emergencyContact: {
            name:         { type: String, required: true, trim: true },
            phone:        { type: String, required: true, trim: true },
            relationship: { type: String, required: true, trim: true },
        },
        prescriptions:   [{ type: String, trim: true }],
        appointmentDates: [{ type: Date }],
        notes:        { type: String, default: '' },
        customFields: { type: Schema.Types.Mixed, default: {} },
    },
    { timestamps: true },
);

patientSchema.index({ firstName: 'text', lastName: 'text', phone: 'text' });

export type IPatientDocument = HydratedDocument<IPatient>;
export const PatientModel = model<IPatient>('Patient', patientSchema);
