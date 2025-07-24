# Deployment Guide for Student Life Management System

This document provides instructions for deploying the Student Life Management System to Render.

## Prerequisites

- A Render account (https://render.com)
- A MongoDB Atlas account for the database (https://www.mongodb.com/cloud/atlas)
- Git repository with your Student Life Management System code

## Environment Variables

The following environment variables need to be set in your Render dashboard:

- `MONGO_URL`: Your MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `NODE_ENV`: Set to `production` for production deployment
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins for CORS (optional)

## Deployment Steps

### 1. Set Up MongoDB Atlas

1. Create a MongoDB Atlas cluster if you don't have one already
2. Create a database user with read/write permissions
3. Whitelist all IP addresses (0.0.0.0/0) or specific IPs for your Render service
4. Get your MongoDB connection string

### 2. Deploy to Render

#### Option 1: Using the Render Dashboard

1. Log in to your Render dashboard
2. Click "New" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - Name: `student-life-management-system`
   - Environment: `Node`
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && node index.js`
5. Add environment variables:
   - `MONGO_URL`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string
   - `NODE_ENV`: `production`
6. Click "Create Web Service"

#### Option 2: Using render.yaml (Recommended)

1. Ensure the `render.yaml` file is in your repository root
2. Log in to your Render dashboard
3. Click "New" and select "Blueprint"
4. Connect your GitHub repository
5. Render will automatically detect the `render.yaml` file and create the services
6. Add any required environment variables that are not in the `render.yaml` file

## Troubleshooting

### Common Issues

#### Missing Dependencies

If you see errors like `Cannot find module 'multer'`, make sure all dependencies are properly listed in your `package.json` file and run:

```bash
cd backend
npm install
```

#### File Upload Issues

If file uploads are not working:

1. Check that the `uploads` and `uploads/assignments` directories exist
2. Ensure the directories have proper write permissions
3. Verify that the `multer` dependency is installed
4. Check that the file size is within the limits (currently 10MB)

#### Database Connection Issues

If you see database connection errors:

1. Verify your MongoDB connection string is correct
2. Ensure your IP is whitelisted in MongoDB Atlas
3. Check that your database user has the correct permissions

#### CORS Issues

If you're experiencing CORS errors:

1. Add your frontend domain to the `ALLOWED_ORIGINS` environment variable
2. Ensure the CORS configuration in `index.js` is correct

## Monitoring and Logs

- View logs in the Render dashboard under your service's "Logs" tab
- Application logs are also stored in the `logs` directory in the application

## Updating Your Deployment

To update your deployment:

1. Push changes to your GitHub repository
2. Render will automatically detect the changes and redeploy your application

## Security Best Practices

1. Never commit `.env` files to your repository
2. Regularly update dependencies to patch security vulnerabilities
3. Use environment variables for all sensitive information
4. Implement proper input validation and sanitization
5. Set appropriate file upload limits and validations