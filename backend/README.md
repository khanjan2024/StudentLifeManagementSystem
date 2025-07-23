# Student Life Management System - Backend

This is the backend server for the Student Life Management System.

## Features

- **Enhanced Database Connection Handling**: Automatic reconnection with exponential backoff
- **Health Check Endpoints**: Monitor application and database status
- **Detailed Error Logging**: Categorized database errors with recommended actions

## Environment Variables

The following environment variables are required for the application to run properly:

### Required Variables

- `MONGO_URL`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation and verification

### Optional Variables

- `PORT`: Port for the server to listen on (default: 5000)
- `NODE_ENV`: Application environment (development, production, test) (default: development)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins for CORS in production

## Setup

1. Copy `.env.example` to `.env` and update the values:
   ```
   cp .env.example .env
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Check environment variables:
   ```
   npm run check-env
   ```

4. Start the server:
   ```
   npm start
   ```

## Development

For development with auto-reload:
```
npm run dev
```

## Scripts

- `npm start`: Start the server
- `npm run dev`: Start the server with nodemon for development
- `npm run check-env`: Check if all required environment variables are set
- `npm run build`: Install dependencies
- `npm test`: Run tests (not implemented yet)

## Health Check Endpoints

The application provides health check endpoints to monitor its status:

- `GET /health`: Returns overall application health status
- `GET /health/database`: Returns detailed database connection status

## Database Connection Error Handling

The application includes enhanced database connection error handling:

- **Automatic Reconnection**: Attempts to reconnect to the database with exponential backoff
- **Detailed Error Logging**: Provides specific error types and recommended actions
- **Graceful Degradation**: Application continues to run with limited functionality when database is unavailable
- **Connection Monitoring**: Continuously monitors database connection status

### Error Types

The system categorizes database connection errors for better diagnostics:

- **Server Selection Error**: MongoDB server is not accessible
- **Network Error**: Network connectivity issues
- **Connection String Parse Error**: Invalid MongoDB connection string
- **Timeout Error**: Connection attempt timed out
- **Authentication Error**: Invalid database credentials
- **Connection Refused**: MongoDB server is not running or not accessible