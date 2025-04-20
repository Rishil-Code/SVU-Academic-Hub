# SVU Student Management System

A modern web application built to manage student academic records, projects, internships, and certificates at SVU. This project showcases my implementation of a full-stack application using React, TypeScript, and Flask.

## Features I Implemented

### User Authentication & Management
- Created a secure login system with role-based access (Admin, Teacher, Student)
- Implemented user management functionality for creating and managing student/teacher accounts
- Added admin privileges system to control access to different features

### Student Dashboard
- Developed an intuitive dashboard for students to:
  - View and manage their academic certificates
  - Track internship experiences
  - Showcase project work
  - Update personal information

### Teacher Features
- Built a comprehensive teacher interface to:
  - View student records
  - Access student projects and internships
  - Manage grades and academic progress
  - Generate performance reports

### Admin Controls
- Implemented administrative features including:
  - User account management
  - Role assignment
  - System-wide access control
  - Privilege management

### UI/UX Improvements
- Designed a responsive layout that works on all devices
- Implemented dark mode support
- Added loading states and error handling
- Created a consistent color scheme using SVU's branding colors
- Enhanced visibility of UI elements in both light and dark modes

## Technical Implementation

### Frontend (React + TypeScript)
- Used React with TypeScript for type-safe development
- Implemented context-based state management
- Created reusable UI components
- Added form validation and error handling
- Integrated responsive design principles

### Backend (Flask + SQLite)
- Developed RESTful API endpoints for:
  - User authentication
  - CRUD operations for certificates
  - Project management
  - Internship tracking
- Implemented database models using SQLAlchemy
- Added proper error handling and response formatting

### Data Models
- Created comprehensive data models for:
  - Users (Students/Teachers)
  - Certificates
  - Projects
  - Internships
  - Academic Records

### Security Features
- Implemented secure password handling
- Added role-based access control
- Created protected routes
- Managed user sessions

## Project Structure
```
src/
├── components/         # Reusable UI components
├── contexts/          # React context providers
├── hooks/            # Custom React hooks
├── pages/            # Main application pages
├── types/            # TypeScript type definitions
└── utils/            # Utility functions

backend/
├── app.py            # Flask application
└── models/           # Database models
```

## Development Process
1. Started with initial project setup and configuration
2. Implemented basic authentication system
3. Created core database models
4. Developed frontend components and pages
5. Added advanced features like dark mode
6. Implemented error handling and loading states
7. Enhanced UI/UX with responsive design
8. Added admin privileges system
9. Performed testing and bug fixes
10. Made final UI improvements

## Learning Outcomes
Through this project, I gained experience in:
- Full-stack web development
- Database design and management
- User authentication and authorization
- Responsive UI design
- State management in React
- API development with Flask
- TypeScript type system
- Error handling and user feedback
- Project architecture and organization

## Future Improvements
- Add email verification system
- Implement file upload for certificates
- Add real-time notifications
- Enhance mobile responsiveness
- Add data analytics dashboard
- Implement student performance tracking

## Running the Project
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install    # Frontend dependencies
   pip install -r requirements.txt  # Backend dependencies
   ```
3. Start the backend server:
   ```bash
   python backend/app.py
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
5. Access the application at `http://localhost:5173`

## Sample Users

You can log in with these test accounts:

- Student:
  - Username: `student1`

  Administrative Username:Rishil
  Administrative Password:Rishil12