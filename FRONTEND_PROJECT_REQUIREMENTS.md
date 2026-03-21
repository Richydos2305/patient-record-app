# Patient Record Management Web Application

Create a modern, minimalistic patient record management web application using React 19.2 with TypeScript. This application is designed for pharmacists to track and manage patient information with both standard and flexible custom fields.

## Planning Phase

Before implementation, systematically analyze and plan the application architecture:

1. **Architecture Analysis**: Break down the application into logical components and identify data flow patterns, state management needs, and API integration points.

2. **Component Hierarchy Planning**: Map out the component structure from top-level layouts down to individual form elements, identifying reusable components and their props interfaces.

3. **State Management Strategy**: Determine what state should be local vs global, which data needs to be cached, and how to handle optimistic updates for better UX.

4. **API Design Considerations**: Plan the expected API endpoints, data structures, error handling patterns, and file upload requirements.

5. **Responsive Design Strategy**: Identify key breakpoints and how the UI should adapt across desktop, tablet, and mobile viewports.

## Core Requirements

- Build a clean, attractive, and minimalistic user interface
- Implement responsive design that works on desktop and tablet devices
- Use modern React patterns including hooks, context, and server components where appropriate
- Integrate with backend APIs for all data operations

## Key Features to Implement

### 1. Patient Management Dashboard
- Display list of all patients with search and filter capabilities
- Quick view cards showing essential patient info
- Add new patient button prominently displayed

### 2. Standard Patient Fields (always present)
- Full name, date of birth, house address
- Phone number, emergency contact
- Current prescriptions with dosage and frequency
- Prescription date and next appointment date
- Pharmacist notes section

### 3. Flexible Custom Fields System
- Allow pharmacists to add/remove custom fields dynamically
- Support field types: text input, textarea, number, date, dropdown
- Support media uploads: audio recordings, photos, videos
- Each custom field should have a label and be configurable
- Store custom field configurations per patient or globally

### 4. Patient Record Forms
- Create/edit patient forms with real-time validation
- Auto-save functionality to prevent data loss
- Clear visual hierarchy and intuitive field grouping
- File upload areas with drag-and-drop support for media

### 5. Navigation & UX
- Simple sidebar or top navigation
- Breadcrumb navigation for deep pages
- Loading states and error handling
- Confirmation dialogs for destructive actions

## Technical Implementation Requirements

- Use React 19.2 with TypeScript
- Implement proper error boundaries and loading states
- Use CSS modules or styled-components for styling
- Ensure accessibility compliance (ARIA labels, keyboard navigation)
- Implement proper form validation with user-friendly error messages
- Use React Query or SWR for efficient API state management
- Include responsive breakpoints for mobile/tablet compatibility

## API Integration Requirements

- Consume RESTful APIs for CRUD operations on patient records
- Handle file uploads for media custom fields
- Implement proper error handling and user feedback for API calls
- Use proper HTTP methods and status code handling

## Design Guidelines

- Clean, modern aesthetic with plenty of white space
- Consistent color scheme and typography
- Subtle animations and transitions
- Professional medical app appearance
- Clear visual hierarchy and intuitive information architecture

## Steps

1. **Project Setup**: Initialize React 19.2 project with TypeScript, configure essential dependencies, and set up project structure
2. **Core Components**: Build foundational components (Layout, Navigation, Loading states, Error boundaries)
3. **Patient Dashboard**: Implement patient list view with search, filtering, and patient cards
4. **Standard Forms**: Create patient creation/editing forms with standard fields and validation
5. **Custom Fields System**: Implement dynamic custom field creation, configuration, and rendering
6. **File Upload System**: Build drag-and-drop file upload with preview and validation
7. **API Integration**: Connect all components to backend APIs with proper error handling
8. **Responsive Design**: Implement responsive layouts and test across devices
9. **Accessibility & Polish**: Add ARIA labels, keyboard navigation, and final UI polish

## Output Format

Provide a complete, production-ready React TypeScript application with the following structure:

```
src/
├── components/           # Reusable UI components
├── pages/               # Route components
├── hooks/               # Custom React hooks
├── services/            # API integration layer
├── types/               # TypeScript type definitions
├── utils/               # Helper functions
├── styles/              # CSS modules or styled-components
└── contexts/            # React context providers
```

For each major component or feature, include:
- TypeScript interfaces for all props and data structures
- Comprehensive error handling and loading states
- Accessibility attributes (ARIA labels, roles, etc.)
- Responsive CSS with mobile-first approach
- Unit tests for critical functionality

## Examples

### Patient Dashboard Component Structure
```typescript
interface Patient {
  id: string;
  fullName: string;
  dateOfBirth: string;
  phoneNumber: string;
  // [additional standard and custom fields]
}

interface PatientDashboardProps {
  patients: Patient[];
  onCreatePatient: () => void;
  onEditPatient: (id: string) => void;
  // [additional handlers]
}
```

### Custom Field Configuration
```typescript
interface CustomField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'date' | 'dropdown' | 'file';
  required: boolean;
  options?: string[]; // for dropdown type
  // [validation rules, display settings]
}
```

### API Service Example
```typescript
class PatientService {
  async getPatients(): Promise<Patient[]> {
    // [implementation with error handling]
  }
  
  async createPatient(patient: CreatePatientRequest): Promise<Patient> {
    // [implementation with validation and error handling]
  }
  
  // [additional CRUD methods]
}
```

(Note: Real implementation should include complete component logic, comprehensive error handling, loading states, and full TypeScript typing)

## Notes

- Prioritize user experience with smooth transitions and intuitive workflows
- Implement optimistic updates where appropriate for better perceived performance
- Consider HIPAA compliance requirements for medical data handling
- Plan for future scalability with proper component architecture
- Include comprehensive TypeScript typing for all data structures and API responses
- Ensure all custom fields are properly validated both client and server-side
- File uploads should include proper validation for file types, sizes, and security considerations