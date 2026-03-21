import { z } from 'zod';

export const prescriptionSchema = z.object({
  medicationName: z.string().min(1, 'Medication name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  prescriptionDate: z.string().min(1, 'Prescription date is required'),
});

export const patientFormSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  houseAddress: z.string().min(5, 'Address must be at least 5 characters'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 characters'),
  emergencyContact: z.string().min(5, 'Emergency contact is required'),
  nextAppointmentDate: z.string().min(1, 'Next appointment date is required'),
  pharmacistNotes: z.string(),
  currentPrescriptions: z.array(prescriptionSchema),
});

export type PatientFormData = z.infer<typeof patientFormSchema>;
export type PrescriptionFormData = z.infer<typeof prescriptionSchema>;

// Profile update schema
export const profileUpdateSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().optional(),
  companyName: z.string().optional(),
  companyLogo: z.string().optional(),
  primaryColor: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, 'Invalid hex color').optional(),
});

export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;
