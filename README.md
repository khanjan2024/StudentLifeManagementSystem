# College Management System

![College Management System](https://img.shields.io/badge/College-Management%20System-blue)
![MERN Stack](https://img.shields.io/badge/MERN-Stack-green)
![Version](https://img.shields.io/badge/version-1.0.0-orange)
![License](https://img.shields.io/badge/license-MIT-blue)

A comprehensive web-based College Management System built using the MERN stack (MongoDB, Express.js, React.js, Node.js). This system streamlines administrative tasks, enhances communication between students and teachers, and provides a centralized platform for managing academic activities.

## 📋 Table of Contents

- [Features](#features)
- [User Roles](#user-roles)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Deployment](#deployment)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Administrative Features
- User management (students, teachers, administrators)
- Branch/Department management
- Subject allocation and management
- Timetable creation and management
- Notice board for announcements
- Comprehensive dashboard with statistics

### Academic Features
- Student attendance tracking
- Exam result management
- Assignment creation and submission
- Student performance analytics
- Subject-wise progress tracking

### Communication Features
- Student queries and complaints system
- Teacher responses to student queries
- Branch-specific communication channels
- Notification system for important updates

## 👥 User Roles

### Admin
- System configuration and management
- User account management
- Branch/Department creation and management
- Subject allocation to teachers
- Timetable management
- Notice creation and management

### Teacher
- View assigned subjects and branches
- Manage student attendance
- Create and grade assignments
- Respond to student queries
- View student performance analytics
- Access to branch-specific student data

### Student
- View personal attendance records
- Access exam results and performance metrics
- Submit assignments
- Raise queries and complaints
- View timetable and notices
- Track academic progress

## 💻 Tech Stack

### Frontend
- React.js
- Redux for state management
- Material-UI for responsive design
- Chart.js for data visualization
- Axios for API requests

### Backend
- Node.js
- Express.js
- MongoDB for database
- Mongoose for object modeling
- JWT for authentication
- Bcrypt for password hashing

## 🚀 Installation

### Prerequisites
- Node.js (v14.x or higher)
- MongoDB (v4.x or higher)
- npm or yarn

### Backend Setup
1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/college-management-system.git
   cd college-management-system
   ```

2. Install backend dependencies
   ```bash
   cd backend
   npm install
   ```

3. Set up environment variables (see [Environment Variables](#environment-variables) section)

4. Start the backend server
   ```bash
   npm start
   ```
   The server will run on http://localhost:5000

### Frontend Setup
1. Open a new terminal and navigate to the frontend directory
   ```bash
   cd frontend
   npm install
   ```

2. Start the frontend development server
   ```bash
   npm start
   ```
   The application will open in your browser at http://localhost:3000

## 🔐 Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/college_management_system

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Admin Credentials (for initial setup)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=securepassword
```

## 📱 Usage

### Admin Login
1. Access the application at http://localhost:3000
2. Login with admin credentials
3. Use the dashboard to manage the system

### Teacher Login
1. Access the application at http://localhost:3000
2. Login with teacher credentials provided by admin
3. Manage classes, attendance, and respond to student queries

### Student Login
1. Access the application at http://localhost:3000
2. Login with student credentials provided by admin
3. View attendance, submit assignments, and raise queries

## 🚀 Deployment

### Normal Deployment

This is a straightforward approach to deploy your application with minimal configuration:

#### Step 1: Set Up MongoDB Database

You already have a MongoDB Atlas connection string:
```
mongodb+srv://KhanjanNath:<db_password>@databaseofslms.ebxlkpi.mongodb.net/
```

To use this connection string:

1. **Replace `<db_password>` with your actual password**
2. **Add the database name** at the end (e.g., "school" or "college")

Your final connection string should look like:
```
mongodb+srv://KhanjanNath:your_actual_password@databaseofslms.ebxlkpi.mongodb.net/school
```

This connection string has been added to your backend/.env file. If you need to change the password or database name, update it there.

**Note**: If you don't remember your MongoDB Atlas password, you can reset it:
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Sign in to your account
3. Go to "Database Access"
4. Find your username and click "Edit"
5. Click "Edit Password" and set a new password
6. Update your .env file with the new password

#### Step 2: Deploy Backend (Simplified)

We'll use Render.com which offers a free tier for hosting:

1. **Prepare Your GitHub Repository**:
   - Make sure your project is on GitHub
   - If not, create a GitHub account, create a new repository, and push your code

2. **Create a Render Account**:
   - Go to [Render.com](https://render.com/)
   - Sign up with your GitHub account

3. **Deploy Your Backend**:
   - Click "New +" and select "Web Service"
   - Connect your GitHub repository
   - Fill in these settings:
     - Name: `your-college-system-backend`
     - Root Directory: Leave empty
     - Environment: `Node`
     - Build Command: `cd backend && npm install`
     - Start Command: `cd backend && node server.js`
   - Under "Advanced" settings, add these environment variables:
     - `MONGODB_URI`: Paste your MongoDB connection string from Step 1
     - `JWT_SECRET`: Type any random string (e.g., "my-secret-key-123")
     - `PORT`: `5000`
   - Select the free plan
   - Click "Create Web Service"

4. **Wait for Deployment**:
   - Render will automatically build and deploy your backend
   - This may take a few minutes
   - When complete, you'll see a URL like `https://your-college-system-backend.onrender.com`
   - Save this URL for the next step

#### Step 3: Deploy Frontend (Simplified)

We'll use Netlify which offers a free tier for hosting:

1. **Create a Netlify Account**:
   - Go to [Netlify.com](https://www.netlify.com/)
   - Sign up with your GitHub account

2. **Deploy Your Frontend**:
   - Click "Add new site" and select "Import an existing project"
   - Select "Deploy with GitHub"
   - Select your GitHub repository
   - Configure these settings:
     - Base directory: `frontend`
     - Build command: `npm run build`
     - Publish directory: `frontend/build`
   - Click "Deploy site"

3. **Wait for Deployment**:
   - Netlify will automatically build and deploy your frontend
   - When complete, you'll see a URL like `https://your-college-system.netlify.app`

#### Step 4: Connect Frontend to Backend (Simplified)

Now we need to tell your frontend where to find your backend:

1. **Add Environment Variable**:
   - In your Netlify dashboard, click on your site
   - Go to "Site settings" → "Build & deploy" → "Environment"
   - Click "Edit variables"
   - Add a new variable:
     - Key: `REACT_APP_BASE_URL`
     - Value: Your backend URL from Step 2 (e.g., `https://your-college-system-backend.onrender.com`)
   - Click "Save"

2. **Redeploy Your Frontend**:
   - Go to "Deploys" in your Netlify dashboard
   - Click "Trigger deploy" → "Deploy site"
   - Wait for the deployment to complete

#### Step 5: Test Your Application

1. **Visit Your Website**:
   - Go to your Netlify URL (e.g., `https://your-college-system.netlify.app`)
   - You should see the login page

2. **Create an Admin Account**:
   - Register as an admin using the registration page
   - If you encounter any issues, check the browser console for errors

3. **Test All Features**:
   - Create branches, subjects, and users
   - Test student and teacher logins
   - Try creating assignments, attendance records, etc.

Congratulations! Your College Management System is now deployed and accessible online from anywhere. You can share the Netlify URL with others to access your application.

## 🔄 API Endpoints

### Authentication
- `POST /AdminLogin` - Admin login
- `POST /TeacherLogin` - Teacher login
- `POST /StudentLogin` - Student login

### Admin Routes
- `POST /AdminReg` - Register new admin
- `GET /Admin/:id` - Get admin details
- `POST /SclassCreate` - Create new branch/class
- `GET /SclassList/:id` - Get all branches/classes
- `DELETE /Sclass/:id` - Delete branch/class
- `POST /SubjectCreate` - Create new subject
- `GET /AllSubjects/:id` - Get all subjects

### Teacher Routes
- `POST /TeacherReg` - Register new teacher
- `GET /Teachers/:id` - Get all teachers
- `GET /Teacher/:id` - Get teacher details
- `DELETE /Teacher/:id` - Delete teacher
- `PUT /TeacherSubject` - Update teacher subject

### Student Routes
- `POST /StudentReg` - Register new student
- `GET /Students/:id` - Get all students
- `GET /Student/:id` - Get student details
- `DELETE /Student/:id` - Delete student
- `PUT /Student/:id` - Update student details
- `PUT /StudentAttendance/:id` - Update student attendance

### Complain/Query Routes
- `POST /ComplainCreate` - Create new complaint/query
- `GET /ComplainList/:id` - Get all complaints/queries
- `GET /TeacherComplainList/:schoolId/:branchId` - Get branch-specific queries
- `POST /ComplainRespond/:complainId` - Respond to complaint/query
- `PATCH /ComplainResolve/:complainId` - Resolve complaint

### Assignment Routes
- `POST /AssignmentCreate` - Create new assignment
- `GET /Assignments` - Get all assignments
- `POST /AssignmentSubmit/:assignmentId` - Submit assignment
- `GET /AssignmentSubmissions/:assignmentId` - Get assignment submissions
- `DELETE /Assignment/:assignmentId` - Delete assignment

### Timetable Routes
- `POST /TimetableCreate` - Create new timetable
- `GET /Timetables` - Get all timetables
- `PUT /Timetable/:id` - Update timetable
- `DELETE /Timetable/:id` - Delete timetable

## 📸 Screenshots

*[Include screenshots of key features here]*

## 📤 Pushing to GitHub

Follow these steps to push your codebase to GitHub:

### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com/) and sign in (or create an account if you don't have one)
2. Click the "+" icon in the top-right corner and select "New repository"
3. Enter a repository name (e.g., "college-management-system")
4. Add a description (optional)
5. Choose "Public" or "Private" visibility
6. Do NOT initialize with README, .gitignore, or license (since you already have these files)
7. Click "Create repository"

### Step 2: Initialize Git in Your Project

Open a command prompt or terminal in your project's root directory and run:

```bash
git init
```

### Step 3: Add Your Files to Git

```bash
git add .
```

### Step 4: Commit Your Files

```bash
git commit -m "Initial commit"
```

### Step 5: Create Your Own Repository

Since you're getting a permission error (403) when trying to push to Yogndrr's repository, you need to create your own repository:

1. Go to [GitHub](https://github.com/) and sign in with your account (khanjan2024)
2. Click the "+" icon in the top-right corner and select "New repository"
3. Enter a repository name (e.g., "College-Management-System")
4. Add a description (optional)
5. Choose "Public" or "Private" visibility
6. Click "Create repository"

### Step 6: Update Remote URL

You need to change the remote URL to point to your own repository:

```bash
# First, check current remote
git remote -v

# Remove the existing remote
git remote remove origin

# Add your own repository as the remote
git remote add origin https://github.com/khanjan2024/College-Management-System.git
```

### Step 7: Push to GitHub

```bash
git push -u origin main
```

If you're using an older version of Git that uses "master" as the default branch:

```bash
git push -u origin master
```

If you encounter an error about the branch, try:

```bash
git branch -M main
git push -u origin main
```

### Alternative: Use GitHub Desktop

If you're having trouble with command line Git:

1. Download and install [GitHub Desktop](https://desktop.github.com/)
2. Open GitHub Desktop and sign in with your GitHub account
3. Add your local repository (File > Add local repository)
4. Publish your repository to GitHub
5. Follow the prompts to complete the process

### Step 7: Verify Your Repository

Go to your GitHub repository URL (https://github.com/yourusername/your-repository-name) to confirm your code has been pushed successfully.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Developed with ❤️ by KRBS