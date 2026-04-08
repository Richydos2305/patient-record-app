import { z } from 'zod';

export const prescriptionSchema = z.object({
  medicationName: z.string().min(1, 'Medication name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  prescriptionDate: z.string().min(1, 'Prescription date is required'),
});

export const patientFormSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  age: z
    .number({ error: 'Age must be a number' })
    .int('Age must be a whole number')
    .min(0, 'Age must be 0 or greater')
    .max(150, 'Age must be 150 or less'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 characters'),
  appointmentDates: z
    .array(z.object({ date: z.string().min(1, 'Date is required') }))
    .min(1, 'At least one appointment date is required'),
  notes: z.string().optional(),
  // Rows with all fields empty are stripped on submit; validation only runs on filled rows
  prescriptions: z.array(prescriptionSchema.partial()).optional(),
});

export type PatientFormData = z.infer<typeof patientFormSchema>;
export type PrescriptionFormData = z.infer<typeof prescriptionSchema>;

// Profile update schema
export const profileUpdateSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phoneNumber: z.string().optional(),
  companyName: z.string().optional(),
  companyLogo: z.string().optional(),
  primaryColor: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, 'Invalid hex color').optional(),
});

export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;
