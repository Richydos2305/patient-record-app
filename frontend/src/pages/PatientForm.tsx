import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Layout } from '../components/layout/Layout';
import { Input } from '../components/forms/Input';
import { Textarea } from '../components/forms/Textarea';
import { CustomFieldBuilder } from '../components/forms/CustomFieldBuilder';
import { CustomFieldInput } from '../components/forms/CustomFieldInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loading } from '../components/ui/Loading';
import { useToast } from '../contexts/ToastContext';
import { usePatient, useCreatePatient, useUpdatePatient } from '../hooks/usePatients';
import { patientFormSchema, type PatientFormData } from '../utils/validation';
import type { CreatePatientRequest, CustomField, CustomFieldValue } from '../types';

export function PatientForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const isEditing = id !== 'new' && !!id;

  const { data: patient, isLoading: isLoadingPatient } = usePatient(isEditing ? id! : '');
  const createPatient = useCreatePatient();
  const updatePatient = useUpdatePatient();

  // Custom fields state - split by section
  const [personalCustomFields, setPersonalCustomFields] = useState<CustomField[]>([]);
  const [medicalCustomFields, setMedicalCustomFields] = useState<CustomField[]>([]);
  const [customFieldValues, setCustomFieldValues] = useState<CustomFieldValue[]>([]);
  
  // Modal state to track which section is adding a field
  const [showCustomFieldBuilder, setShowCustomFieldBuilder] = useState<{
    show: boolean;
    section?: 'personal' | 'medical';
  }>({ show: false, section: undefined });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      fullName: '',
      dateOfBirth: '',
      address: '',
      phoneNumber: '',
      emergencyContact: { name: '', phone: '', relationship: '' },
      appointmentDates: [{ date: '' }],
      notes: '',
      prescriptions: [],
    },
  });

  const { fields: prescriptionFields, append: appendPrescription, remove: removePrescription } = useFieldArray({
    control,
    name: 'prescriptions',
  });

  const { fields: appointmentFields, append: appendAppointment, remove: removeAppointment } = useFieldArray({
    control,
    name: 'appointmentDates',
  });

  // Load patient data when editing
  useEffect(() => {
    if (patient && isEditing) {
      const toDateInput = (iso: string) => iso.split('T')[0];
      reset({
        fullName: patient.fullName,
        dateOfBirth: toDateInput(patient.dateOfBirth),
        address: patient.address,
        phoneNumber: patient.phoneNumber,
        emergencyContact: patient.emergencyContact,
        appointmentDates: patient.appointmentDates.map((d) => ({ date: toDateInput(d) })),
        notes: patient.notes || '',
        prescriptions: patient.prescriptions.map((rx) => ({
          medicationName: rx.medicationName,
          dosage: rx.dosage,
          frequency: rx.frequency,
          prescriptionDate: toDateInput(rx.prescriptionDate),
        })),
      });
    }
  }, [patient, isEditing, reset]);

  const onSubmit = async (data: PatientFormData) => {
    try {
      // Build customFields as Record<string, unknown> keyed by field name
      const customFieldsMap: Record<string, unknown> = {};
      [...personalCustomFields, ...medicalCustomFields].forEach((field) => {
        const value = customFieldValues.find((v) => v.fieldId === field.id);
        customFieldsMap[field.name] = value?.value ?? '';
      });

      const patientData: CreatePatientRequest = {
        fullName: data.fullName,
        dateOfBirth: data.dateOfBirth,
        address: data.address,
        phoneNumber: data.phoneNumber,
        emergencyContact: data.emergencyContact,
        prescriptions: data.prescriptions || [],
        appointmentDates: data.appointmentDates.map((a) => a.date),
        ...(data.notes ? { notes: data.notes } : {}),
        customFields: customFieldsMap,
      };

      if (isEditing && id) {
        await updatePatient.mutateAsync({ ...patientData, id });
        addToast({
          type: 'success',
          message: 'Patient updated successfully!',
        });
      } else {
        await createPatient.mutateAsync(patientData);
        addToast({
          type: 'success',
          message: 'Patient created successfully!',
        });
      }

      navigate('/');
    } catch (error) {
      addToast({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to save patient',
      });
    }
  };

  const handleAddCustomField = useCallback((field: Omit<CustomField, 'id'>, section: 'personal' | 'medical') => {
    const newField: CustomField = {
      ...field,
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    
    if (section === 'personal') {
      setPersonalCustomFields(prev => [...prev, newField]);
    } else {
      setMedicalCustomFields(prev => [...prev, newField]);
    }
    
    // Initialize the value for this field
    setCustomFieldValues(prev => [...prev, { 
      fieldId: newField.id, 
      field: newField,
      value: '' 
    }]);
  }, []);

  const handleRemoveCustomField = useCallback((fieldId: string, section: 'personal' | 'medical') => {
    if (section === 'personal') {
      setPersonalCustomFields(prev => prev.filter((f) => f.id !== fieldId));
    } else {
      setMedicalCustomFields(prev => prev.filter((f) => f.id !== fieldId));
    }
    setCustomFieldValues(prev => prev.filter(v => v.fieldId !== fieldId));
  }, []);

  const handleCustomFieldChange = useCallback((value: CustomFieldValue) => {
    setCustomFieldValues(prev => {
      const existing = prev.findIndex(v => v.fieldId === value.fieldId);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = value;
        return updated;
      }
      return [...prev, value];
    });
  }, []);

  const handleSaveCustomField = useCallback((field: Omit<CustomField, 'id'>) => {
    if (showCustomFieldBuilder.section) {
      handleAddCustomField(field, showCustomFieldBuilder.section);
      setShowCustomFieldBuilder({ show: false, section: undefined });
    }
  }, [showCustomFieldBuilder.section, handleAddCustomField]);

  const handleCloseCustomFieldBuilder = useCallback(() => {
    setShowCustomFieldBuilder({ show: false, section: undefined });
  }, []);

  if (isEditing && isLoadingPatient) {
    return (
      <Layout>
        <Loading message="Loading patient data..." fullScreen />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="-ml-4 mb-4"
            aria-label="Back to dashboard"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground">
            {isEditing ? 'Edit Patient' : 'Add New Patient'}
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" aria-label={isEditing ? 'Edit patient form' : 'Add new patient form'}>
          {/* Personal Information Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle id="personal-info-heading">Personal Information</CardTitle>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowCustomFieldBuilder({ show: true, section: 'personal' })}
                  aria-label="Add custom field to personal information"
                >
                  Add Custom Field
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  {...register('fullName')}
                  error={errors.fullName?.message}
                  required
                />
                <Input
                  label="Date of Birth"
                  type="date"
                  {...register('dateOfBirth')}
                  error={errors.dateOfBirth?.message}
                  required
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  {...register('phoneNumber')}
                  error={errors.phoneNumber?.message}
                  placeholder="+234 (803) 000-0000"
                  required
                />
                <Input
                  label="Emergency Contact Name"
                  {...register('emergencyContact.name')}
                  error={errors.emergencyContact?.name?.message}
                  placeholder="Contact full name"
                  required
                />
                <Input
                  label="Emergency Contact Phone"
                  {...register('emergencyContact.phone')}
                  error={errors.emergencyContact?.phone?.message}
                  placeholder="Contact phone number"
                  required
                />
                <Input
                  label="Emergency Contact Relationship"
                  {...register('emergencyContact.relationship')}
                  error={errors.emergencyContact?.relationship?.message}
                  placeholder="e.g., Spouse, Parent"
                  required
                />
              </div>
              
              <Input
                label="Home Address"
                {...register('address')}
                error={errors.address?.message}
                placeholder="Street, City, State ZIP"
                required
              />
              
              {/* Render personal custom fields */}
              {personalCustomFields.map((field) => {
                const value = customFieldValues.find(v => v.fieldId === field.id);
                return (
                  <div key={field.id} className="relative">
                    <CustomFieldInput
                      field={field}
                      value={value}
                      onChange={handleCustomFieldChange}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveCustomField(field.id, 'personal')}
                      className="absolute top-0 right-0"
                      aria-label={`Remove ${field.label} field`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Medical Information Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle id="medical-info-heading">Medical Information</CardTitle>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowCustomFieldBuilder({ show: true, section: 'medical' })}
                  aria-label="Add custom field to medical information"
                >
                  Add Custom Field
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Appointment Dates */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Appointment Dates *</label>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => appendAppointment({ date: '' })}
                    aria-label="Add appointment date"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Date
                  </Button>
                </div>
                {errors.appointmentDates?.root?.message && (
                  <p className="text-sm text-destructive mb-2" role="alert">
                    {errors.appointmentDates.root.message}
                  </p>
                )}
                {appointmentFields.map((apptField, index) => (
                  <div key={apptField.id} className="flex items-center gap-2 mb-2">
                    <Input
                      label={`Appointment ${index + 1}`}
                      type="date"
                      {...register(`appointmentDates.${index}.date`)}
                      error={errors.appointmentDates?.[index]?.date?.message}
                    />
                    {appointmentFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAppointment(index)}
                        className="mt-6"
                        aria-label={`Remove appointment ${index + 1}`}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Textarea
                label="Notes"
                {...register('notes')}
                error={errors.notes?.message}
                placeholder="Add any relevant notes about the patient..."
                rows={4}
              />
              
              {/* Render medical custom fields */}
              {medicalCustomFields.map((field) => {
                const value = customFieldValues.find(v => v.fieldId === field.id);
                return (
                  <div key={field.id} className="relative">
                    <CustomFieldInput
                      field={field}
                      value={value}
                      onChange={handleCustomFieldChange}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveCustomField(field.id, 'medical')}
                      className="absolute top-0 right-0"
                      aria-label={`Remove ${field.label} field`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Current Prescriptions Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle id="prescriptions-heading">Current Prescriptions</CardTitle>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    appendPrescription({
                      medicationName: '',
                      dosage: '',
                      frequency: '',
                      prescriptionDate: new Date().toISOString().split('T')[0],
                    })
                  }
                  aria-label="Add prescription"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Prescription
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {prescriptionFields.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8" role="status">
                  No prescriptions added yet. Click "Add Prescription" to add one.
                </p>
              ) : (
                <div className="space-y-6">
                  {prescriptionFields.map((field, index) => (
                    <div key={field.id} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">
                          Prescription {index + 1}
                        </h3>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removePrescription(index)}
                          aria-label={`Remove prescription ${index + 1}`}
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Remove
                        </Button>
                      </div>
                      <Separator className="my-4" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Medication Name"
                          {...register(`prescriptions.${index}.medicationName`)}
                          error={errors.prescriptions?.[index]?.medicationName?.message}
                          required
                        />
                        <Input
                          label="Dosage"
                          {...register(`prescriptions.${index}.dosage`)}
                          error={errors.prescriptions?.[index]?.dosage?.message}
                          placeholder="e.g., 10mg"
                          required
                        />
                        <Input
                          label="Frequency"
                          {...register(`prescriptions.${index}.frequency`)}
                          error={errors.prescriptions?.[index]?.frequency?.message}
                          placeholder="e.g., Once daily"
                          required
                        />
                        <Input
                          label="Prescription Date"
                          type="date"
                          {...register(`prescriptions.${index}.prescriptionDate`)}
                          error={errors.prescriptions?.[index]?.prescriptionDate?.message}
                          required
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-3 justify-end" role="group" aria-label="Form actions">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} aria-label={isEditing ? 'Update patient record' : 'Create patient record'}>
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Patient' : 'Create Patient'}
            </Button>
          </div>
        </form>
      </div>

      {/* Custom Field Builder Modal */}
      {showCustomFieldBuilder.show && (
        <CustomFieldBuilder
          onSave={handleSaveCustomField}
          onClose={handleCloseCustomFieldBuilder}
        />
      )}
    </Layout>
  );
}
