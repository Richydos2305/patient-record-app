import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { PatientCard } from '../components/patient/PatientCard';
import { Button } from '@/components/ui/button';
import { Loading } from '../components/ui/Loading';
import { EmptyState } from '../components/ui/EmptyState';
import { SearchBar } from '../components/ui/SearchBar';
import { usePatients } from '../hooks/usePatients';

export function Dashboard() {
  const navigate = useNavigate();
  const { data, isLoading, error } = usePatients();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter patients based on search query
  const filteredPatients = useMemo(() => {
    if (!data?.patients) return [];

    if (!searchQuery.trim()) return data.patients;

    const query = searchQuery.toLowerCase();
    return data.patients.filter(
      (patient) =>
        patient.fullName.toLowerCase().includes(query) ||
        patient.phoneNumber.includes(query) ||
        patient.address.toLowerCase().includes(query)
    );
  }, [data, searchQuery]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Patient Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground" aria-live="polite">
              {data?.patients?.length || 0} patient{data?.patients?.length !== 1 ? 's' : ''} registered
            </p>
          </div>
          <Button onClick={() => navigate('/patients/new')} aria-label="Add new patient">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Patient
          </Button>
        </header>

        <div className="mb-6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by name, phone, or address..."
          />
        </div>

        {isLoading ? (
          <Loading message="Loading patients..." />
        ) : error ? (
          <div className="py-12">
            <EmptyState
              icon={
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              title="Failed to load patients"
              description="There was an error loading patient data. Please try again."
            />
          </div>
        ) : filteredPatients.length === 0 ? (
          <EmptyState
            icon={
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            }
            title={searchQuery ? 'No patients found' : 'No patients yet'}
            description={
              searchQuery
                ? 'Try adjusting your search criteria.'
                : 'Get started by adding your first patient.'
            }
            action={
              !searchQuery && (
                <Button onClick={() => navigate('/patients/new')}>
                  Add Your First Patient
                </Button>
              )
            }
          />
        ) : (
          <section 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            aria-label="Patient list"
          >
            {filteredPatients.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))}
          </section>
        )}
      </div>
    </Layout>
  );
}
