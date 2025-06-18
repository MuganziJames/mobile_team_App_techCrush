# TechCrush API Integration - AfriStyle Mobile App

## Overview
This document describes the integration of the TechCrush authentication API into the AfriStyle React Native mobile application.

## 🔗 API Details
- **Base URL**: `https://my-style-mag-backend.onrender.com/api/v1`
- **Documentation**: Available via Swagger UI at the base URL
- **Authentication**: Uses JWT tokens and HTTP-only cookies

## 📁 Implementation Structure

### Core Files Created/Modified:
```
api/
  ├── types.ts          # TypeScript interfaces for API
  ├── axios.ts          # Axios client with interceptors
  ├── auth.service.ts   # Authentication service methods
  └── test.ts           # Simple API testing utilities

constants/
  └── Config.ts         # Configuration constants

contexts/
  └── AuthContext.tsx   # Updated to use real API
```

## 🛠️ Features Implemented

### 1. Authentication Service (`api/auth.service.ts`)
- **register()** - Create new user account
- **login()** - Authenticate user and store tokens
- **logout()** - Clear session and local data  
- **forgotPassword()** - Request password reset email
- **verifyResetToken()** - Verify OTP/reset token
- **changePassword()** - Set new password with reset token
- **authCheck()** - Verify current session
- **bootstrapAuth()** - Initialize auth state on app startup

### 2. Axios Client (`api/axios.ts`)
- Automatic JWT token attachment
- Cookie handling for cross-platform compatibility
- Request/response interceptors
- Error handling and token cleanup on 401
- TypeScript error transformation

### 3. Updated AuthContext (`contexts/AuthContext.tsx`)
- Real API integration replacing mock authentication
- Backward compatibility with existing UI components
- Proper error handling and loading states
- Automatic token persistence and restoration

## 🔧 Configuration

### Environment Setup
The API URL is configured in `constants/Config.ts`:
```typescript
API_URL: process.env.EXPO_PUBLIC_API_URL || 'https://my-style-mag-backend.onrender.com/api/v1'
```

### Required Packages
```bash
npx expo install axios @react-native-async-storage/async-storage
```

## 🧪 Testing the Integration

### 1. Manual Testing Flow
1. **Registration**: 
   - Go to signup screen
   - Fill form with name, email, password
   - Should create account and auto-login

2. **Login**:
   - Use existing account credentials
   - Should authenticate and navigate to main app

3. **Password Reset**:
   - Use "Forgot Password" flow
   - Enter email → receive OTP → enter OTP → set new password

4. **Session Management**:
   - Close and reopen app
   - Should automatically restore authentication state

### 2. Demo Credentials
For testing purposes, you can use:
- **Email**: `demo@example.com`
- **Password**: `password123`

*(Note: These need to be registered first via the registration flow)*

## 🔒 Security Features

### Token Management
- JWT tokens stored in AsyncStorage
- Automatic token attachment to requests
- Token cleanup on logout/401 errors

### Cookie Support
- HTTP-only cookies for web compatibility
- Cross-platform cookie management
- Automatic cookie parsing and storage

### Error Handling
- Consistent error formatting
- Automatic retry logic for network issues
- Graceful degradation on API failures

## 🚨 Important Notes

### CORS Configuration
The backend must allow:
```
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: <your-expo-dev-url>
```

### Cookie Security
For production, ensure cookies have:
- `Secure` flag (HTTPS only)
- `SameSite=None` for cross-origin requests
- `HttpOnly` flag for security

### Development vs Production
- Development: May use HTTP and relaxed cookie settings
- Production: Requires HTTPS and strict security headers

## 🐛 Troubleshooting

### Common Issues:

1. **Network Errors**:
   - Check API base URL in Config.ts
   - Verify network connectivity
   - Check CORS settings on backend

2. **Authentication Failures**:
   - Verify API endpoints match documentation
   - Check request/response formats
   - Validate JWT token format

3. **Cookie Issues**:
   - iOS Simulator may have cookie restrictions
   - Use physical device for full testing
   - Check cookie domain/path settings

## 📱 Supported Platforms
- ✅ iOS (device and simulator)
- ✅ Android (device and emulator)  
- ✅ Expo Go (for development)
- ⚠️ Web (limited cookie support in development)

## 🔄 Next Steps
1. Test all authentication flows thoroughly
2. Configure production environment variables
3. Set up proper error monitoring
4. Add refresh token logic if needed
5. Implement biometric authentication (optional)

## 📞 Support
For issues with the API integration, check:
1. Console logs for detailed error messages
2. Network tab in debugger for API calls
3. AsyncStorage for token persistence
4. Cookie storage for session management 