// Configuration constants for the app
export const Config = {
  // API Configuration
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'https://my-style-mag-backend.onrender.com/api/v1',
  
  // Other configuration options
  APP_NAME: 'AfriStyle',
  VERSION: '1.0.0',
  
  // Development flags
  isDevelopment: process.env.NODE_ENV === 'development',
  enableLogging: process.env.NODE_ENV === 'development',
};

export default Config; 