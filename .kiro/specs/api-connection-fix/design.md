# Design Document

## Overview

This design document outlines the approach for fixing the API connection issues in the Student Life Management System. The primary issue is that the frontend application is encountering "ERR_CONNECTION_REFUSED" errors when attempting to connect to the backend API at http://localhost:5000, preventing users from logging in and using the system.

## Architecture

The Student Life Management System follows a client-server architecture:

1. **Frontend**: React application that provides the user interface
2. **Backend**: Express.js server that provides API endpoints and business logic
3. **Database**: MongoDB database for data storage

The connection between the frontend and backend is managed through HTTP requests using Axios, with the base URL configured through environment variables.

## Components and Interfaces

### Frontend Components

1. **API Service Layer**
   - Responsible for making HTTP requests to the backend
   - Uses Axios for HTTP communication
   - Should use environment-specific base URLs

2. **Environment Configuration**
   - `.env` files for environment-specific configuration
   - Should include API base URL configuration for different environments

3. **Error Handling Component**
   - Displays user-friendly error messages for API connection issues
   - Implements retry logic for transient connection failures

### Backend Components

1. **Express Server**
   - Listens on configured port (default: 5000)
   - Provides API endpoints for frontend consumption

2. **Environment Configuration**
   - Uses dotenv for loading environment variables
   - Includes port configuration and other server settings

## Data Models

No new data models are required for this fix. The existing models remain unchanged.

## Implementation Strategy

### 1. Frontend API Configuration

The frontend needs a consistent way to determine the correct API base URL based on the environment:

```javascript
// api/config.js
const getApiBaseUrl = () => {
  // For local development
  if (process.env.NODE_ENV === 'development') {
    return process.env.REACT_APP_API_URL || 'http://localhost:5000';
  }
  
  // For production
  return process.env.REACT_APP_API_URL || 'https://studentlifemanagementsystem.onrender.com';
};

export const API_BASE_URL = getApiBaseUrl();
```

### 2. API Service Implementation

Create a centralized API service that uses the configured base URL:

```javascript
// api/apiService.js
import axios from 'axios';
import { API_BASE_URL } from './config';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle connection errors
    if (!error.response) {
      // Network error or server not running
      console.error('API Connection Error:', error.message);
      // You could dispatch to a global error state here
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 3. Error Handling Strategy

Implement a consistent error handling approach:

```javascript
// utils/errorHandler.js
export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  if (!error.response) {
    // Network error or server not running
    return {
      message: 'Unable to connect to the server. Please check your internet connection or try again later.',
      details: error.message
    };
  }
  
  // Server returned an error response
  const status = error.response.status;
  
  switch (status) {
    case 400:
      return {
        message: error.response.data.message || 'Invalid request',
        details: error.response.data
      };
    case 401:
      // Handle unauthorized (could trigger logout)
      return {
        message: 'Your session has expired. Please log in again.',
        details: error.response.data
      };
    case 404:
      return {
        message: 'The requested resource was not found',
        details: error.response.data
      };
    case 500:
      return {
        message: 'Server error. Please try again later.',
        details: error.response.data
      };
    default:
      return {
        message: defaultMessage,
        details: error.response.data
      };
  }
};
```

### 4. Backend Server Configuration

Ensure the backend server is properly configured to run on the expected port:

```javascript
// backend/index.js
const PORT = process.env.PORT || 5000;

// Log the port the server is running on for debugging
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Error Handling

1. **Connection Errors**
   - Display user-friendly error messages
   - Implement retry logic for transient failures
   - Log detailed error information for debugging

2. **Server Startup Errors**
   - Validate required environment variables
   - Log detailed error information
   - Provide clear instructions for resolution

## Testing Strategy

1. **Local Development Testing**
   - Test API connections in development environment
   - Verify correct base URL is used
   - Test error handling for various connection scenarios

2. **Production Environment Testing**
   - Verify API connections in production environment
   - Test with actual deployed backend
   - Verify error handling in production context

3. **Error Scenario Testing**
   - Test behavior when backend server is not running
   - Test behavior with network connectivity issues
   - Test behavior with invalid API responses