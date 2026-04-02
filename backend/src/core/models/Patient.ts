import { Schema, model, HydratedDocument } from 'mongoose';
import { IPatient } from '../interfaces/models';

export type { IPatient };

const prescriptionSchema = new Schema(
    {
        medicationName:   { type: String, required: true, trim: true },
        dosage:           { type: String, required: true, trim: true },
        frequency:        { type: String, required: true, trim: true },
        prescriptionDate: { type: String, required: true },
    },
    { _id: true },
);

const patientSchema = new Schema<IPatient>(
    {
        fullName:    { type: String, required: true, trim: true },
        dateOfBirth: { type: Date, required: true },
        address:     { type: String, required: true, trim: true },
        phoneNumber: { type: String, required: true, trim: true },
        emergencyContact: {
            name:         { type: String, required: true, trim: true },
            phone:        { type: String, required: true, trim: true },
            relationship: { type: String, required: true, trim: true },
        },
        prescriptions:    [prescriptionSchema],
        appointmentDates: [{ type: Date }],
        notes:            { type: String, default: '' },
        customFields:     { type: Schema.Types.Mixed, default: {} },
    },
    {
        timestamps: true,
    },
);

patientSchema.index({ fullName: 'text', phoneNumber: 'text' });

export type IPatientDocument = HydratedDocument<IPatient>;
export const PatientModel = model<IPatient>('Patient', patientSchema);
