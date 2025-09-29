# Frontend Connection Guide - Pump Journal Backend

## 🚀 **Backend is Live!**

Your backend API is now deployed and ready for connection:

**Backend URL:** `https://pump-journal-backend-production.up.railway.app`

## 🔧 **Frontend Configuration Update**

### **Step 1: Update Environment Variables**

Create or update your frontend environment variables:

```bash
# .env.local (for local development)
NEXT_PUBLIC_API_URL=https://pump-journal-backend-production.up.railway.app

# .env.production (for production deployment)
NEXT_PUBLIC_API_URL=https://pump-journal-backend-production.up.railway.app
```

### **Step 2: Verify API Configuration**

Your frontend should already be configured to use this environment variable. Check that all your API calls use:

```typescript
// This should already be in your code
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Example from your login page
const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
```

## 🧪 **Test Your Connection**

### **Quick Health Check**

```bash
curl https://pump-journal-backend-production.up.railway.app/
```

Should return: `{"message":"Pump Journal API is running!"}`

### **Test User Registration**

```bash
curl -X POST https://pump-journal-backend-production.up.railway.app/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### **Test User Login**

```bash
curl -X POST https://pump-journal-backend-production.up.railway.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 📋 **Available API Endpoints**

### **Authentication Endpoints**

```
POST /auth/register          - User registration
POST /auth/login             - User login
POST /auth/change-password   - Change password (protected)
POST /auth/forgot-password   - Request password reset
POST /auth/reset-password    - Reset password with token
```

### **Training Sessions Endpoints**

```
GET    /trainings            - Get all user's training sessions
POST   /trainings            - Create new training session
GET    /trainings/:id        - Get specific training session
PUT    /trainings/:id        - Update training session
DELETE /trainings/:id        - Delete training session
```

## 🔒 **CORS Configuration**

The backend is configured to allow requests from:

- ✅ `https://pump-journal-frontend.vercel.app` (your production frontend)
- ✅ `http://localhost:3001` (local development)
- ✅ `http://localhost:3000` (alternative local port)

## 🚀 **Deployment Steps**

### **Option 1: Update Existing Vercel Deployment**

1. Update your environment variable in Vercel dashboard:
   - Go to your Vercel project settings
   - Add/update: `NEXT_PUBLIC_API_URL=https://pump-journal-backend-production.up.railway.app`
2. Redeploy your frontend

### **Option 2: Local Testing First**

1. Create `.env.local` file with the API URL
2. Run `npm run dev` locally
3. Test all functionality
4. Deploy to Vercel when ready

## ✅ **Verification Checklist**

Test these features to ensure everything works:

### **Authentication Flow**

- [ ] User registration works
- [ ] User login works
- [ ] Protected routes redirect to login when not authenticated
- [ ] JWT tokens are stored in localStorage
- [ ] Logout clears tokens and redirects to login

### **Training Sessions**

- [ ] Dashboard loads user's training sessions
- [ ] Create new training session works
- [ ] Edit existing training session works
- [ ] Delete training session works
- [ ] View individual training session details works

### **Data Validation**

- [ ] Form validation works (required fields, number formats)
- [ ] Error messages display correctly
- [ ] Success messages show after operations

### **Advanced Features**

- [ ] Dashboard filtering works (date range, day of week, exercise name, goal)
- [ ] Exercise input with tempo selection works
- [ ] Sets with reps/weight tracking works
- [ ] Heart rate tracking works
- [ ] Session notes work

## 🐛 **Troubleshooting**

### **Common Issues**

**1. CORS Errors**

- Ensure your frontend URL is in the backend's CORS configuration
- Check that you're using HTTPS for production

**2. Authentication Issues**

- Verify JWT tokens are being sent in Authorization headers
- Check that tokens are stored in localStorage
- Ensure backend JWT secret is properly configured

**3. API Connection Issues**

- Verify `NEXT_PUBLIC_API_URL` environment variable is set correctly
- Test the backend URL directly with curl
- Check browser network tab for failed requests

**4. Data Format Issues**

- Ensure request bodies match the expected format
- Check that dates are in YYYY-MM-DD format
- Verify numeric fields are sent as numbers, not strings

### **Debug Mode**

Add this to your frontend for debugging:

```typescript
// Add to your API calls for debugging
console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
console.log("Request:", { method, url, headers, body });
```

## 🎉 **Your App is Ready!**

Once you've updated the environment variable and redeployed:

1. **Users can register** new accounts
2. **Users can login** and access their dashboard
3. **Users can create** training sessions with exercises and sets
4. **Users can view, edit, and delete** their training sessions
5. **Users can filter** their workout history
6. **Users can change** their passwords
7. **Users can reset** forgotten passwords

Your Pump Journal fitness tracking app is now fully functional! 🏋️‍♂️

## 📞 **Support**

If you encounter any issues:

1. Check the backend logs in Railway dashboard
2. Check the frontend logs in Vercel dashboard
3. Test API endpoints directly with curl
4. Verify environment variables are set correctly
5. Check browser developer tools for network errors

The backend is production-ready and fully tested! 🚀
