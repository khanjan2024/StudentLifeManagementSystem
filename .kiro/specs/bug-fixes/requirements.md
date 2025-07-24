# Requirements Document

## Introduction

This document outlines the requirements for fixing critical bugs identified in the MERN College Management System. The system currently has several security vulnerabilities, authentication issues, error handling problems, and inconsistencies that need to be addressed to ensure proper functionality and security.

## Requirements

### Requirement 1

**User Story:** As a system administrator, I want secure password authentication for admin login, so that unauthorized users cannot access admin accounts with plain text password comparison.

#### Acceptance Criteria

1. WHEN an admin attempts to login THEN the system SHALL use bcrypt to compare the provided password with the hashed password stored in the database
2. WHEN an admin registers THEN the system SHALL store only the hashed password in the database
3. WHEN password validation fails THEN the system SHALL return an appropriate error message without exposing system details

### Requirement 2

**User Story:** As a developer, I want consistent error handling across all controllers, so that the application doesn't crash and provides meaningful error responses.

#### Acceptance Criteria

1. WHEN an error occurs in any controller THEN the system SHALL use the correct error variable name in catch blocks
2. WHEN a database operation fails THEN the system SHALL return a 500 status code with the actual error object
3. WHEN validation fails THEN the system SHALL return appropriate error messages to the client

### Requirement 3

**User Story:** As a developer, I want consistent variable usage in update operations, so that password updates work correctly across all user types.

#### Acceptance Criteria

1. WHEN updating a student password THEN the system SHALL use req.body.password instead of res.body.password
2. WHEN updating any user password THEN the system SHALL properly hash the new password before saving
3. WHEN password hashing fails THEN the system SHALL handle the error appropriately

### Requirement 4

**User Story:** As a frontend developer, I want consistent API base URL configuration, so that the application works reliably across different environments.

#### Acceptance Criteria

1. WHEN the frontend makes API calls THEN the system SHALL use environment variables for the base URL when available
2. WHEN environment variables are not available THEN the system SHALL fall back to a hardcoded localhost URL
3. WHEN API calls are made THEN the system SHALL use the same base URL configuration across all API handlers

### Requirement 5

**User Story:** As a system user, I want proper route handling for delete operations, so that delete functionality works as expected.

#### Acceptance Criteria

1. WHEN delete routes are defined THEN the system SHALL ensure all referenced controller functions exist and are properly exported
2. WHEN a delete operation is requested THEN the system SHALL execute the correct controller function
3. WHEN delete operations fail THEN the system SHALL provide appropriate error feedback

### Requirement 6

**User Story:** As a developer, I want clean and consistent code structure, so that debugging and maintenance are easier.

#### Acceptance Criteria

1. WHEN controllers are defined THEN the system SHALL remove commented-out code that is no longer needed
2. WHEN debugging statements are added THEN the system SHALL remove console.log statements from production code
3. WHEN functions are exported THEN the system SHALL ensure all exported functions are properly implemented

### Requirement 7

**User Story:** As an admin user, I want to see proper branch/department and semester information in the class details section, so that I can identify classes correctly instead of seeing "Not set" values.

#### Acceptance Criteria

1. WHEN viewing class details THEN the system SHALL display the correct branch/department name from the database
2. WHEN viewing class details THEN the system SHALL display the correct semester information from the database
3. WHEN branch data is missing or null THEN the system SHALL handle the error gracefully and provide meaningful feedback

### Requirement 8

**User Story:** As a teacher, I want to be able to create assignments through the Teacher/assignments page, so that I can assign work to my students.

#### Acceptance Criteria

1. WHEN a teacher accesses /Teacher/assignments THEN the system SHALL display a functional assignment creation form
2. WHEN a teacher has teachSubject and teachBranch data THEN the system SHALL populate the subject and class dropdown fields correctly
3. WHEN a teacher submits a valid assignment form THEN the system SHALL create the assignment successfully and display a success message
4. WHEN assignment creation fails THEN the system SHALL display appropriate error messages to help the teacher understand what went wrong
5. WHEN a teacher's profile lacks required teachSubject or teachBranch data THEN the system SHALL handle this gracefully and provide clear feedback

### Requirement 9

**User Story:** As a teacher, I want to only see student queries from my assigned branch, so that I can focus on relevant queries and maintain proper data isolation between branches.

#### Acceptance Criteria

1. WHEN a teacher views student queries THEN the system SHALL only display queries from students in the teacher's assigned branch
2. WHEN a teacher responds to a query THEN the system SHALL verify the query belongs to a student in the teacher's branch
3. WHEN fetching queries THEN the system SHALL filter queries based on the teacher's branch assignment
4. WHEN a teacher has no assigned branch THEN the system SHALL handle this gracefully and provide appropriate feedback
### R
equirement 10

**User Story:** As an admin, I want to see accurate attendance percentages for students without the total sessions column, so that I can correctly assess student attendance.

#### Acceptance Criteria

1. WHEN viewing a student's attendance details THEN the system SHALL NOT display the "Total Sessions" column
2. WHEN calculating attendance percentage THEN the system SHALL use the actual number of attendance records rather than the sessions value from the subject schema
3. WHEN displaying attendance percentage THEN the system SHALL show the correct percentage based on present attendance divided by total attendance records