# Backend Development Prompt - Patient Record Management System

Create a robust backend API server using TypeScript, Express.js, and MongoDB for a patient record management system designed for pharmacists. The system must handle both standard patient information and flexible custom fields including media uploads.

## Important: Reference Repository Required

**You must provide the location/path of your reference repository or existing code structure that should be used as a template for the code architecture, file organization, coding patterns, and implementation approaches. All code should follow the established patterns from this reference repository.**

# Planning and Analysis Phase

Before implementation, systematically analyze and design the backend architecture:

1. **Reference Code Analysis**: Examine the provided reference repository to understand the established architectural patterns, file organization, coding conventions, and implementation approaches that should be followed.

2. **Database Schema Design**: Based on the reference patterns, design MongoDB schemas that can efficiently handle both structured and dynamic data while maintaining query performance.

3. **API Architecture Planning**: Following the reference repository's API structure, map out the complete endpoint organization and service layer patterns.

4. **File Storage Strategy**: Implement file handling using the patterns established in the reference repository, adapting them for medical data requirements.

5. **Integration Planning**: Ensure all implementations align with the reference repository's patterns for error handling, validation, middleware, and service organization.

## Core Requirements

- Build RESTful API endpoints using Express.js with TypeScript
- Connect to MongoDB database for data persistence
- Implement proper error handling, validation, and security practices
- Support file uploads and media storage for custom fields
- Follow the code structure and patterns from the provided reference repository

## Database Design

- Design flexible MongoDB schemas that can accommodate custom fields
- Standard patient fields: name, DOB, address, phone, emergency contact, prescriptions, appointment dates, notes
- Dynamic custom fields system supporting various data types and media files
- Proper indexing for search and query performance

## API Endpoints to Implement

### 1. Patient CRUD Operations
```
GET /api/patients - List all patients with pagination and search
GET /api/patients/:id - Get specific patient details
POST /api/patients - Create new patient record
PUT /api/patients/:id - Update existing patient
DELETE /api/patients/:id - Delete patient record
```

### 2. Custom Fields Management
```
GET /api/custom-fields - Get available custom field definitions
POST /api/custom-fields - Create new custom field type
PUT /api/custom-fields/:id - Update custom field definition
DELETE /api/custom-fields/:id - Remove custom field type
```

### 3. File Upload & Media Handling
```
POST /api/upload - Handle file uploads (images, audio, video)
GET /api/files/:filename - Serve uploaded files
DELETE /api/files/:filename - Delete uploaded files
```

### 4. Search & Filtering
```
GET /api/patients/search?q=query - Search patients by name, phone, etc.
GET /api/patients/filter - Filter by custom criteria
```

## Key Features

### 1. Flexible Data Storage
- Store standard patient fields in structured format
- Handle dynamic custom fields using flexible schema design
- Support various data types: text, number, date, boolean, file references
- Maintain data integrity and validation

### 2. File Upload Management
- Handle multipart file uploads for images, audio, and video
- Implement file size limits and type validation
- Store files securely with proper naming conventions
- Generate and serve file URLs for frontend consumption

### 3. Data Validation & Security
- Implement comprehensive input validation using libraries like Joi or Yup
- Sanitize user inputs to prevent injection attacks
- Add rate limiting for API endpoints
- Implement proper CORS configuration

### 4. Error Handling & Logging
- Consistent error response format across all endpoints
- Proper HTTP status codes for different scenarios
- Comprehensive logging for debugging and monitoring
- Graceful handling of database connection issues

## Technical Implementation Requirements

- Use Express.js with TypeScript for type safety
- Implement MongoDB connection with Mongoose ODM
- Use middleware for authentication, validation, and error handling
- Implement proper async/await patterns with error handling
- Add compression and security headers
- Include API documentation (OpenAPI/Swagger)
- Environment-based configuration management
- **Follow all architectural patterns, file structure, and coding conventions from the provided reference repository**

# Steps

1. **Reference Repository Analysis**: Thoroughly analyze the provided reference repository to understand the established patterns and structure
2. **Project Adaptation**: Adapt the reference structure for patient record management functionality
3. **Database Models**: Implement patient and custom field schemas following reference patterns
4. **API Implementation**: Build all endpoints using the established route and controller patterns
5. **File Upload Integration**: Implement file handling following reference repository approaches
6. **Testing and Documentation**: Apply testing and documentation patterns from reference repository

# Output Format

Provide a complete, production-ready Express.js TypeScript backend that strictly follows the patterns, structure, and conventions established in the provided reference repository. Adapt the reference architecture to implement the patient record management functionality while maintaining consistency with the established codebase patterns.

# Notes

- **All implementation must follow the reference repository patterns** - do not deviate from established architectural approaches
- Adapt existing patterns for patient management functionality rather than creating new patterns
- Maintain consistency with reference repository's error handling, validation, and response formats
- Use the same testing approaches and documentation style as the reference repository
- Follow the reference repository's naming conventions, file organization, and coding style throughout