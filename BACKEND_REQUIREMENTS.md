# Pump Journal Backend API Requirements & Analysis

## Overview

This document provides comprehensive requirements for building the backend API for the Pump Journal fitness tracking application. The frontend is already deployed on Vercel and expects a RESTful API with JWT authentication.

## Frontend Analysis Summary

### Application Architecture

- **Framework**: Next.js 15.3.2 with React 18.3.1 (App Router)
- **Deployment**: Production-ready on Vercel
- **Authentication**: JWT tokens stored in localStorage with React Context
- **Validation**: Zod schemas for client-side validation
- **UI**: Modern design with Tailwind CSS, Radix UI components, and Lucide icons
- **State Management**: React hooks with Context API for auth

### Key Frontend Features Identified

1. **Complete Authentication Flow**: Register, login, logout, password change, forgot/reset password
2. **Training Session Management**: Create, read, update, delete with complex nested data
3. **Advanced Filtering**: Date ranges, day of week, exercise name, and goal filtering
4. **Rich Exercise Input**: Tempo selection, rest periods, sets with reps/weight, comments
5. **Real-time Validation**: Client-side validation with immediate feedback
6. **Responsive Design**: Mobile-first approach with adaptive layouts

### Data Flow Patterns

- **Consistent Error Handling**: All API calls follow the same error handling pattern
- **Loading States**: Proper loading indicators throughout the application
- **Form Validation**: Zod validation before API submission
- **Token Management**: Automatic token inclusion in headers, localStorage persistence

### Critical API Integration Points

#### Authentication Context Analysis

```typescript
// Frontend expects this exact interface
interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
}
```

- Tokens are automatically loaded from localStorage on app initialization
- All protected routes check for token presence and redirect to login if missing
- Token is automatically included in Authorization headers for all API calls

#### Error Handling Pattern

```typescript
// Consistent across all API calls
try {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/endpoint`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.message || "Operation failed");
  }

  const data = await res.json();
  // Handle success
} catch (err: unknown) {
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError("Unknown error");
  }
}
```

#### Form Data Processing

- **Date Handling**: Frontend converts Date objects to ISO strings (YYYY-MM-DD format)
- **Number Conversion**: All numeric inputs are converted using `Number()` before submission
- **Validation**: Zod schemas validate data before API calls, backend should match these rules
- **Nested Objects**: Complex nested structures (exercises -> sets) are properly serialized

#### Frontend Filtering Capabilities

The dashboard implements client-side filtering that the backend should support:

- **Date Range**: Filter sessions between two dates
- **Day of Week**: Filter by specific days (Sunday-Saturday)
- **Exercise Name**: Text search within exercise names
- **Goal**: Text search within session goals

**Recommendation**: Implement server-side filtering for better performance with large datasets.

#### Exercise Data Structure Deep Dive

```typescript
// Frontend tempo options - backend should validate against these
const TEMPO_OPTIONS = [
  { value: "2-0-2", label: "2-0-2 (Normal speed)" },
  { value: "2-1-2", label: "2-1-2 (Pause bottom)" },
  { value: "3-0-1", label: "3-0-1 (Explosive up)" },
  { value: "3-1-3", label: "3-1-3 (Controlled)" },
  { value: "1-0-1", label: "1-0-1 (Fast)" },
  { value: "custom", label: "Custom…" },
];
```

#### Heart Rate Data Structure

```typescript
// Frontend expects this exact structure
heartRate: {
  start: number; // BPM at session start
  end: number; // BPM at session end
}
```

### Validation Requirements & Edge Cases

#### Password Requirements (From Frontend)

- **Minimum Length**: 6 characters (as shown in registration placeholder)
- **No Complexity Requirements**: Frontend doesn't enforce special characters or numbers
- **Backend Should**: Implement basic password strength validation

#### Date Handling Edge Cases

```typescript
// Frontend date processing
date: date ? date.toISOString().slice(0, 10) : "";
```

- **Format**: Always YYYY-MM-DD (ISO date format)
- **Timezone**: Frontend uses local timezone, backend should store as UTC
- **Validation**: Backend should validate date is not in the future (business rule)

#### Numeric Field Handling

```typescript
// Frontend number conversion patterns
rest: Number(ex.rest),
reps: Number(set.reps),
weight: Number(set.weight)
```

- **Zero Values**: Frontend allows 0 for reps, weight, rest - backend should accept
- **Negative Values**: Frontend prevents negative inputs via min="0"
- **Decimal Values**: Frontend supports decimals for weight (e.g., 135.5 lbs)

#### Exercise Validation Rules

- **Name**: Required, minimum 1 character
- **Tempo**: Required, must match predefined options or custom value
- **Rest**: Required, minimum 0 seconds
- **Sets**: Minimum 1 set required per exercise
- **Comments**: Optional, can be empty strings

#### Set Validation Rules

- **Reps**: Required, minimum 0 (allows for holds/static exercises)
- **Weight**: Required, minimum 0 (allows for bodyweight exercises)
- **Comments**: Optional, can be empty strings

### Performance Considerations

#### Frontend Loading Patterns

- **Dashboard**: Loads all sessions at once (no pagination currently implemented)
- **Session Details**: Loads individual session on demand
- **Form Submission**: No optimistic updates, waits for server response

#### Recommended Backend Optimizations

1. **Pagination**: Implement for sessions list (frontend may need updates later)
2. **Indexing**: Index on userId, date, dayOfWeek for fast queries
3. **Caching**: Consider Redis for session data
4. **Rate Limiting**: Implement to prevent abuse

### Security Analysis

#### Frontend Security Patterns

- **Token Storage**: localStorage (not httpOnly cookies)
- **XSS Protection**: Relies on modern React practices
- **CSRF**: Not implemented (relies on SameSite cookies)
- **Input Sanitization**: Basic HTML escaping in React

#### Backend Security Requirements

1. **JWT Security**: Use strong secrets, proper expiration
2. **Input Validation**: Server-side validation for all inputs
3. **SQL Injection**: Use parameterized queries
4. **Rate Limiting**: Implement per-endpoint limits
5. **CORS**: Configure for frontend domain only

### Error Message Standards

#### Frontend Error Display Patterns

```typescript
// Consistent error message handling
if (!res.ok) {
  const errData = await res.json();
  throw new Error(errData.message || "Operation failed");
}
```

#### Backend Error Response Format

```json
{
  "message": "Human-readable error message",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

**Critical**: Frontend only displays the `message` field, so ensure it's user-friendly.

## Implementation Recommendations

### Development Priority Order

1. **Authentication System** - Core JWT implementation with all auth endpoints
2. **Basic Training Sessions CRUD** - Get the core functionality working
3. **Data Validation** - Implement server-side validation matching Zod schemas
4. **Error Handling** - Consistent error responses and proper HTTP status codes
5. **Security Hardening** - Rate limiting, input sanitization, CORS
6. **Performance Optimization** - Indexing, caching, pagination

### Technology Stack Suggestions

- **Node.js/Express** or **Python/FastAPI** or **Go/Gin** - All work well with JWT
- **PostgreSQL** or **MongoDB** - Both handle nested exercise data well
- **Redis** - For session caching and rate limiting
- **Docker** - For consistent deployment environments

### Testing Strategy

1. **Unit Tests** - Test all validation logic and business rules
2. **Integration Tests** - Test complete API workflows
3. **Frontend Integration** - Test with actual frontend deployment
4. **Load Testing** - Ensure performance under realistic load

### Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] SSL/HTTPS enabled
- [ ] CORS configured for frontend domain
- [ ] Rate limiting implemented
- [ ] Error monitoring setup (Sentry, etc.)
- [ ] Health check endpoint
- [ ] API documentation (Swagger/OpenAPI)

### Monitoring & Observability

- **Health Checks**: `/health` endpoint for load balancer
- **Metrics**: Response times, error rates, request counts
- **Logging**: Structured logging for debugging
- **Alerts**: Set up alerts for error rates and response times

## Frontend Context

- **Framework**: Next.js 15.3.2 with React 18.3.1
- **Deployment**: Vercel (production ready)
- **Authentication**: JWT tokens stored in localStorage
- **Validation**: Zod schemas for data validation
- **UI**: Modern design with Tailwind CSS and Radix UI components

## Base URL Configuration

The frontend expects the API base URL to be configured via environment variable:

```
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
```

## Authentication System

### JWT Token Structure

- **Token Type**: Bearer JWT
- **Storage**: Frontend stores tokens in localStorage
- **Header Format**: `Authorization: Bearer <token>`

### Required Authentication Endpoints

#### 1. User Registration

```
POST /api/auth/register
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response (201):
{
  "access_token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com"
  }
}

Error Response (400/409):
{
  "message": "Email already exists"
}
```

#### 2. User Login

```
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response (200):
{
  "access_token": "jwt_token_here"
}

Error Response (401):
{
  "message": "Invalid credentials"
}
```

#### 3. Change Password (Protected)

```
POST /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "oldPassword": "old_password",
  "newPassword": "new_password"
}

Response (200):
{
  "message": "Password changed successfully"
}

Error Response (400/401):
{
  "message": "Current password is incorrect"
}
```

#### 4. Forgot Password

```
POST /api/auth/forgot-password
Content-Type: application/json

Request Body:
{
  "email": "user@example.com"
}

Response (200):
{
  "message": "Reset link sent",
  "resetUrl": "https://frontend-domain.com/auth/reset-password?token=reset_token"
}

Error Response (404):
{
  "message": "Email not found"
}
```

#### 5. Reset Password

```
POST /api/auth/reset-password
Content-Type: application/json

Request Body:
{
  "token": "reset_token_from_url",
  "newPassword": "new_password"
}

Response (200):
{
  "message": "Password reset successfully"
}

Error Response (400):
{
  "message": "Invalid or expired token"
}
```

## Training Sessions API

### Data Models

#### Set Model

```typescript
interface Set {
  reps: number;
  weight: number;
  comment?: string;
}
```

#### Exercise Model

```typescript
interface Exercise {
  name: string;
  tempo: string;
  rest: number;
  comment?: string;
  sets: Set[];
}
```

#### Training Session Model

```typescript
interface TrainingSession {
  _id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  timeOfDay?: string;
  goal: string;
  dayOfWeek?: string;
  heartRate?: {
    start: number;
    end: number;
  };
  exercises: Exercise[];
  sessionNote?: string;
  userId: string; // Backend should add this
  createdAt?: string;
  updatedAt?: string;
}
```

### Required Training Session Endpoints

#### 1. Create Training Session (Protected)

```
POST /api/trainings
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "date": "2024-01-15",
  "timeOfDay": "Morning",
  "goal": "Strength training",
  "dayOfWeek": "Monday",
  "heartRate": {
    "start": 90,
    "end": 120
  },
  "exercises": [
    {
      "name": "Bench Press",
      "tempo": "2-1-2",
      "rest": 120,
      "comment": "Felt strong today",
      "sets": [
        {
          "reps": 10,
          "weight": 135,
          "comment": "Easy set"
        },
        {
          "reps": 8,
          "weight": 155
        }
      ]
    }
  ],
  "sessionNote": "Great workout session"
}

Response (201):
{
  "_id": "session_id",
  "date": "2024-01-15",
  "timeOfDay": "Morning",
  "goal": "Strength training",
  "dayOfWeek": "Monday",
  "heartRate": {
    "start": 90,
    "end": 120
  },
  "exercises": [...],
  "sessionNote": "Great workout session",
  "userId": "user_id",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}

Error Response (400):
{
  "message": "Validation failed: Exercise name is required"
}
```

#### 2. Get All Training Sessions (Protected)

```
GET /api/trainings
Authorization: Bearer <token>

Response (200):
[
  {
    "_id": "session_id_1",
    "date": "2024-01-15",
    "goal": "Strength training",
    "dayOfWeek": "Monday",
    "heartRate": { "start": 90, "end": 120 },
    "exercises": [...],
    "sessionNote": "Great workout",
    "userId": "user_id",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  },
  // ... more sessions
]

Error Response (401):
{
  "message": "Unauthorized"
}
```

#### 3. Get Single Training Session (Protected)

```
GET /api/trainings/:id
Authorization: Bearer <token>

Response (200):
{
  "_id": "session_id",
  "date": "2024-01-15",
  "goal": "Strength training",
  "dayOfWeek": "Monday",
  "heartRate": { "start": 90, "end": 120 },
  "exercises": [...],
  "sessionNote": "Great workout",
  "userId": "user_id",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}

Error Response (404):
{
  "message": "Training session not found"
}
```

#### 4. Update Training Session (Protected)

```
PUT /api/trainings/:id
Authorization: Bearer <token>
Content-Type: application/json

Request Body: (Same as create, but without _id)

Response (200):
{
  "_id": "session_id",
  "date": "2024-01-15",
  // ... updated session data
  "updatedAt": "2024-01-15T11:00:00Z"
}

Error Response (403):
{
  "message": "Not authorized to update this session"
}
```

#### 5. Delete Training Session (Protected)

```
DELETE /api/trainings/:id
Authorization: Bearer <token>

Response (200):
{
  "message": "Training session deleted successfully"
}

Error Response (403):
{
  "message": "Not authorized to delete this session"
}
```

## Data Validation Requirements

### Zod Schema Implementation

The frontend uses these validation schemas - ensure backend validation matches:

```typescript
// Set validation
{
  reps: number (min: 0),
  weight: number (min: 0),
  comment?: string
}

// Exercise validation
{
  name: string (required, min length: 1),
  tempo: string (required, min length: 1),
  rest: number (min: 0),
  comment?: string,
  sets: array (min length: 1)
}

// Training session validation
{
  date: string (required, format: YYYY-MM-DD),
  dayOfWeek: string (required, min length: 1),
  timeOfDay: string (required, min length: 1),
  goal: string (required, min length: 1),
  heartRate: {
    start: number (min: 0),
    end: number (min: 0)
  },
  exercises: array (min length: 1),
  sessionNote?: string
}
```

## Security Requirements

### JWT Configuration

- **Algorithm**: HS256 or RS256
- **Expiration**: 24 hours (configurable)
- **Refresh Token**: Optional but recommended for production
- **Secret**: Strong secret key (minimum 256 bits)

### Password Security

- **Hashing**: bcrypt with salt rounds >= 12
- **Minimum Length**: 6 characters (as shown in frontend)
- **Complexity**: Basic validation recommended

### Authorization

- Users can only access their own training sessions
- Implement user ownership validation for all protected endpoints
- Return 403 for unauthorized access attempts

### CORS Configuration

- Allow frontend domain (Vercel deployment URL)
- Allow localhost:3000 for development
- Include credentials in CORS settings

## Error Handling Standards

### HTTP Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (invalid/missing token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **409**: Conflict (email already exists)
- **500**: Internal Server Error

### Error Response Format

```json
{
  "message": "Human-readable error message",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

## Database Requirements

### User Model

```typescript
interface User {
  _id: string;
  email: string;
  password: string; // hashed
  createdAt: Date;
  updatedAt: Date;
}
```

### Training Session Model

```typescript
interface TrainingSession {
  _id: string;
  userId: string; // Reference to User
  date: string;
  timeOfDay?: string;
  goal: string;
  dayOfWeek?: string;
  heartRate?: {
    start: number;
    end: number;
  };
  exercises: Exercise[];
  sessionNote?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Recommended Database Features

- **Indexing**: Email field, userId field, date field
- **Constraints**: Unique email, required fields
- **Relationships**: User -> Training Sessions (one-to-many)

## Environment Variables

### Required Environment Variables

```
JWT_SECRET=your_jwt_secret_key
DATABASE_URL=your_database_connection_string
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### Optional Environment Variables

```
JWT_EXPIRES_IN=24h
BCRYPT_ROUNDS=12
LOG_LEVEL=info
```

## Deployment Considerations

### Production Requirements

- **HTTPS**: Required for production
- **Database**: PostgreSQL/MongoDB recommended
- **Hosting**: Railway, Render, AWS, or similar
- **Monitoring**: Basic logging and error tracking
- **Rate Limiting**: Implement to prevent abuse

### Performance Optimization

- **Pagination**: For training sessions list (frontend may need this later)
- **Caching**: Consider Redis for session management
- **Database Indexing**: Optimize for common queries

## Testing Requirements

### API Testing

- Unit tests for all endpoints
- Integration tests for authentication flow
- Validation testing for all data models
- Error handling testing

### Security Testing

- JWT token validation
- Authorization boundary testing
- Input sanitization testing
- SQL injection prevention (if using SQL database)

## Additional Features (Future Considerations)

### Potential Enhancements

- **Password Reset Email**: SMTP integration for email delivery
- **Session Analytics**: Aggregate workout data
- **Exercise Templates**: Pre-defined exercise configurations
- **Progress Tracking**: Charts and statistics
- **Social Features**: Share workouts with friends
- **Mobile API**: Push notifications for workout reminders

## Frontend Integration Notes

### Token Management

- Frontend automatically includes `Authorization: Bearer <token>` header
- Tokens are stored in localStorage
- Frontend handles token expiration by redirecting to login

### Error Handling

- Frontend displays error messages from `message` field
- Frontend handles 401 errors by clearing tokens and redirecting
- Frontend validates data client-side before sending to API

### Date Handling

- All dates should be in ISO format (YYYY-MM-DD)
- Time zones should be handled consistently
- Frontend uses JavaScript Date objects internally

This backend should be production-ready and handle the current frontend requirements while being extensible for future features. The API should be well-documented and follow RESTful conventions.
