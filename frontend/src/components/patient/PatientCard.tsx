import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Patient } from '../../types';

interface PatientCardProps {
  patient: Patient;
}

export function PatientCard({ patient }: PatientCardProps) {
  const navigate = useNavigate();

  const age = calculateAge(patient.dateOfBirth);
  const nextAppointment = new Date(patient.nextAppointmentDate);
  const isUpcoming = nextAppointment > new Date();

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      onClick={() => navigate(`/patients/${patient.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(`/patients/${patient.id}`);
        }
      }}
      aria-label={`View patient record for ${patient.fullName}, ${age} years old`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <svg
              className="h-7 w-7 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg leading-none tracking-tight">{patient.fullName}</h3>
            <p className="text-sm text-muted-foreground mt-1">{age} years old</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <svg
              className="h-4 w-4 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span aria-label={`Phone number: ${patient.phoneNumber}`}>{patient.phoneNumber}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <svg
              className="h-4 w-4 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span 
              className={isUpcoming ? 'text-primary font-medium' : 'text-muted-foreground'}
              aria-label={`Next appointment: ${formatDate(patient.nextAppointmentDate)}${isUpcoming ? ' (upcoming)' : ' (past)'}`}
            >
              {formatDate(patient.nextAppointmentDate)}
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Current Prescriptions</h4>
          {patient.currentPrescriptions.length > 0 ? (
            <div className="space-y-2" aria-label="List of current prescriptions">
              {patient.currentPrescriptions.slice(0, 2).map((rx) => (
                <div key={rx.id} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{rx.medicationName}</span>
                  <Badge variant="secondary" className="text-xs">{rx.dosage}</Badge>
                </div>
              ))}
              {patient.currentPrescriptions.length > 2 && (
                <p className="text-xs text-muted-foreground" aria-label={`${patient.currentPrescriptions.length - 2} more prescriptions`}>
                  +{patient.currentPrescriptions.length - 2} more
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No prescriptions</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
}
