# Backend Developer Prompt: Pump Journal API

## Project Overview

You need to build a RESTful API backend for the **Pump Journal** fitness tracking application. The frontend is already built, deployed on Vercel, and ready for production. Your job is to create a backend that seamlessly integrates with the existing frontend.

## What You're Building

A fitness tracking API that allows users to:

- Register/login with email/password
- Create, read, update, and delete training sessions
- Track exercises with sets, reps, weight, tempo, and rest periods
- Filter and view their workout history
- Manage their account (change passwords, reset passwords)

## Frontend Analysis Summary

### Key Technical Details

- **Framework**: Next.js 15.3.2 with React 18.3.1
- **Authentication**: JWT tokens stored in localStorage
- **Validation**: Zod schemas for client-side validation
- **API Calls**: All use `fetch()` with Bearer token authentication
- **Error Handling**: Consistent pattern across all components

### Critical Integration Points

#### 1. Authentication Flow

```typescript
// Frontend expects these exact response formats:
// Login/Register Success:
{ "access_token": "jwt_token_here" }

// All Errors:
{ "message": "Human-readable error message" }
```

#### 2. API Base URL

Frontend uses: `process.env.NEXT_PUBLIC_API_URL`
Set this to your backend domain: `https://your-backend-domain.com/api`

#### 3. Request Headers

```typescript
// All protected requests include:
headers: {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${token}`
}
```

## Required API Endpoints

### Authentication Endpoints

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/change-password
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### Training Sessions Endpoints

```
GET    /api/trainings           # Get all user's sessions
POST   /api/trainings           # Create new session
GET    /api/trainings/:id       # Get specific session
PUT    /api/trainings/:id       # Update session
DELETE /api/trainings/:id       # Delete session
```

## Data Models (Must Match Frontend Types)

### Training Session Structure

```typescript
interface TrainingSession {
  _id: string;
  date: string; // YYYY-MM-DD format
  timeOfDay?: string;
  goal: string;
  dayOfWeek?: string;
  heartRate?: {
    start: number; // BPM
    end: number; // BPM
  };
  exercises: Exercise[];
  sessionNote?: string;
  userId: string; // Backend adds this
  createdAt?: string;
  updatedAt?: string;
}
```

### Exercise Structure

```typescript
interface Exercise {
  name: string;
  tempo: string; // e.g., "2-1-2", "3-0-1", "custom"
  rest: number; // seconds
  comment?: string;
  sets: Set[];
}
```

### Set Structure

```typescript
interface Set {
  reps: number;
  weight: number;
  comment?: string;
}
```

## Validation Rules (From Frontend Zod Schemas)

### Training Session Validation

- `date`: Required, YYYY-MM-DD format
- `dayOfWeek`: Required, string (Sunday-Saturday)
- `timeOfDay`: Required, string
- `goal`: Required, minimum 1 character
- `heartRate.start`: Number, minimum 0
- `heartRate.end`: Number, minimum 0
- `exercises`: Array, minimum 1 exercise
- `sessionNote`: Optional string

### Exercise Validation

- `name`: Required, minimum 1 character
- `tempo`: Required, minimum 1 character
- `rest`: Number, minimum 0
- `sets`: Array, minimum 1 set

### Set Validation

- `reps`: Number, minimum 0
- `weight`: Number, minimum 0

## Important Frontend Behaviors

### 1. Error Handling Pattern

```typescript
// Frontend always expects this format:
if (!res.ok) {
  const errData = await res.json();
  throw new Error(errData.message || "Operation failed");
}
```

### 2. Date Processing

```typescript
// Frontend sends dates as:
date: date.toISOString().slice(0, 10); // "2024-01-15"
```

### 3. Number Conversion

```typescript
// Frontend converts all numbers:
rest: Number(ex.rest),
reps: Number(set.reps),
weight: Number(set.weight)
```

### 4. Authorization

- All protected routes check for JWT token
- Missing token = redirect to login
- Invalid token = show error message

## Security Requirements

### JWT Configuration

- **Algorithm**: HS256 or RS256
- **Expiration**: 24 hours recommended
- **Secret**: Strong secret key (256+ bits)
- **Payload**: Include user ID for authorization

### Password Security

- **Hashing**: bcrypt with 12+ salt rounds
- **Minimum Length**: 6 characters (matching frontend)
- **Validation**: Basic strength requirements

### Authorization Rules

- Users can only access their own training sessions
- Return 403 for unauthorized access attempts
- Validate JWT on all protected endpoints

### CORS Configuration

- Allow frontend domain (Vercel deployment URL)
- Allow localhost:3000 for development
- Include credentials in CORS settings

## Performance Considerations

### Database Indexing

```sql
-- Recommended indexes:
CREATE INDEX idx_trainings_user_id ON trainings(user_id);
CREATE INDEX idx_trainings_date ON trainings(date);
CREATE INDEX idx_trainings_day_of_week ON trainings(day_of_week);
CREATE INDEX idx_users_email ON users(email);
```

### Frontend Filtering

The dashboard implements client-side filtering for:

- Date ranges (from/to dates)
- Day of week (Sunday-Saturday)
- Exercise name (text search)
- Goal (text search)

**Recommendation**: Implement server-side filtering for better performance.

## Error Response Standards

### HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (email already exists)
- `500`: Internal Server Error

### Error Response Format

```json
{
  "message": "Human-readable error message"
}
```

**Critical**: Frontend only displays the `message` field.

## Development Recommendations

### Phase 1: Core Functionality

1. Set up project with JWT authentication
2. Implement user registration/login
3. Create basic training session CRUD
4. Test with frontend integration

### Phase 2: Validation & Security

1. Implement server-side validation matching Zod schemas
2. Add proper error handling
3. Implement authorization checks
4. Add rate limiting and CORS

### Phase 3: Performance & Production

1. Add database indexing
2. Implement caching (Redis recommended)
3. Add monitoring and logging
4. Set up health checks

## Testing Strategy

### Essential Tests

1. **Authentication Flow**: Register → Login → Access Protected Routes
2. **Training Session CRUD**: Create, read, update, delete sessions
3. **Authorization**: Users can only access their own data
4. **Validation**: All Zod schema rules are enforced
5. **Error Handling**: Proper HTTP status codes and messages

### Integration Testing

- Test with actual frontend deployment
- Verify all API calls work as expected
- Test error scenarios (invalid tokens, missing data, etc.)

## Deployment Requirements

### Environment Variables

```
JWT_SECRET=your_strong_secret_key
DATABASE_URL=your_database_connection_string
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### Production Checklist

- [ ] HTTPS enabled
- [ ] Database migrations run
- [ ] CORS configured for frontend domain
- [ ] Rate limiting implemented
- [ ] Error monitoring setup
- [ ] Health check endpoint at `/health`
- [ ] API documentation available

## Success Criteria

Your backend is ready when:

1. ✅ Frontend can register new users
2. ✅ Frontend can login and access protected routes
3. ✅ Users can create, view, edit, and delete training sessions
4. ✅ All validation rules match frontend expectations
5. ✅ Error messages are user-friendly
6. ✅ API handles edge cases gracefully
7. ✅ Performance is acceptable for production use

## Getting Started

1. **Read the complete requirements**: Check `BACKEND_REQUIREMENTS.md` for detailed API specifications
2. **Choose your tech stack**: Node.js/Express, Python/FastAPI, or Go/Gin are all good choices
3. **Set up authentication first**: JWT implementation is critical
4. **Test early and often**: Use the frontend to validate your API
5. **Follow the validation rules**: Match the frontend Zod schemas exactly

The frontend is production-ready and waiting for your API. Focus on getting the core functionality working first, then optimize for performance and security.

Good luck! 🏋️‍♂️
