import { Schema, model, Document } from 'mongoose';
import { IPatient, ICustomValue } from '../interfaces/models';

export interface PatientDocument extends IPatient, Document {}

const customValueSchema = new Schema<ICustomValue>(
  {
    fieldId: { type: String, required: true },
    value: { type: Schema.Types.Mixed, required: true }
  },
  { _id: false }
);

const patientSchema = new Schema<PatientDocument>(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User'
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    dob: {
      type: Date
    },
    address: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    emergencyContact: {
      type: String,
      trim: true
    },
    prescriptions: {
      type: [String],
      default: []
    },
    appointmentDates: {
      type: [Date],
      default: []
    },
    notes: {
      type: String
    },
    customValues: {
      type: [customValueSchema],
      default: []
    }
  },
  { timestamps: true }
);

patientSchema.index({ userId: 1 });
patientSchema.index({ name: 'text', phone: 'text', notes: 'text' });

export const Patient = model<PatientDocument>('Patient', patientSchema);
