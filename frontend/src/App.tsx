import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { QueryProvider } from './contexts/QueryContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { PatientForm } from './pages/PatientForm';
import { Profile } from './pages/Profile';
import { Toast } from './components/ui/Toast';
import { initializeMockData } from './services/mockApi';
import './App.css';

// Initialize mock data
initializeMockData();

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <QueryProvider>
            <ToastProvider>
              <Toast />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/patients/:id"
                  element={
                    <ProtectedRoute>
                      <PatientForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ToastProvider>
          </QueryProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
