import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientApi } from '../services/mockApi';
import type { CreatePatientRequest, UpdatePatientRequest } from '../types';

export function usePatients() {
  return useQuery({
    queryKey: ['patients'],
    queryFn: () => patientApi.getPatients(),
  });
}

export function usePatient(id: string) {
  return useQuery({
    queryKey: ['patient', id],
    queryFn: () => patientApi.getPatient(id),
    enabled: !!id,
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePatientRequest) => patientApi.createPatient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePatientRequest) => patientApi.updatePatient(data),
    onSuccess: (updatedPatient) => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['patient', updatedPatient.id] });
    },
  });
}

export function useDeletePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => patientApi.deletePatient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
}
