Authentication System — Backend

A secure, backend-only authentication system built with Node.js, Express.js, and MongoDB. The application implements JWT-based authentication using access and refresh tokens, bcrypt password hashing, and email OTP verification powered by Resend.

This project demonstrates practical backend development concepts, authentication workflows, API design, and secure user account management.

Features

- User Authentication: API-based user registration and login.
- Email OTP Verification: Email verification using Resend.
- Password Security: Password hashing using bcrypt instead of storing plain-text passwords.
- JWT Authentication: Token-based authentication using JSON Web Tokens.
- Access Tokens: Short-lived tokens for authenticating requests to protected routes.
- Refresh Tokens: Tokens used to obtain new access tokens without requiring the user to log in again, according to the implemented refresh flow.
- MongoDB Integration: Persistent storage of user data using MongoDB.
- Protected Routes: Middleware to restrict access to authenticated users, where implemented.
- REST APIs: Structured HTTP endpoints for authentication-related operations.
- Environment Configuration: Sensitive configuration values managed through environment variables.

Tech Stack

Technology| Purpose
Node.js| JavaScript runtime
Express.js| Backend framework
MongoDB| Database
Mongoose| MongoDB object modeling, if used
JSON Web Token (JWT)| Access and refresh token authentication
bcrypt| Password hashing
Resend| Sending OTP verification emails
Git and GitHub| Version control and project hosting

Authentication Flow

1. Registration: The client submits the required registration details to the backend.
2. Email OTP Verification: The backend sends an OTP email using Resend and verifies the submitted OTP.
3. Password Security: Passwords are hashed using bcrypt before being stored in the database.
4. Login: The backend validates the user's credentials.
5. Access Token: The backend issues an access token for authenticated API requests.
6. Refresh Token: The refresh flow allows the client to obtain a new access token when the current access token expires.
7. Protected Resources: The backend validates authentication tokens before granting access to protected endpoints.

The exact sequence depends on how registration, OTP verification, and token issuance are implemented in the application.

Getting Started

Prerequisites

- Node.js and npm
- MongoDB local installation or MongoDB Atlas account
- Resend account and API key
- Postman or another API testing tool

Installation

1. Clone the repository

git clone YOUR_REPOSITORY_URL

2. Navigate to the project directory

cd authentication

3. Install dependencies

npm install

4. Configure environment variables

Create a ".env" file in the project root and add the variables required by your application.

Example configuration:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
RESEND_API_KEY=your_resend_api_key

Add any other variables your code requires, such as an email sender address or OTP configuration. Use the exact variable names expected by your application.

Never commit your real ".env" file, API keys, database credentials, or JWT secrets to GitHub.

5. Start the server

Use the script configured in your "package.json". For example:

npm start

For development, if a development script is configured:

npm run dev

API Endpoints

The following is an example endpoint layout. Replace the paths with the actual routes implemented in your project.

Method| Endpoint| Purpose
POST| "/api/auth/register"| Register a user
POST| "/api/auth/send-otp"| Send an email OTP
POST| "/api/auth/verify-otp"| Verify the OTP
POST| "/api/auth/login"| Authenticate a user
POST| "/api/auth/refresh"| Obtain a new access token
POST| "/api/auth/logout"| Log out or invalidate tokens, if implemented

Document the request body, response format, and authentication requirements for each endpoint.

Testing

Use Postman or a similar API client to test the authentication endpoints.

Test cases can include:

- Successful registration and login
- Invalid credentials
- Incorrect or expired OTPs
- Missing or invalid access tokens
- Expired access tokens
- Refresh token validation
- Invalid request data

Security Considerations

- Hash passwords using bcrypt.
- Keep secrets in environment variables.
- Validate authentication tokens on protected routes.
- Use appropriate token expiration times.
- Validate OTPs and enforce expiration and attempt limits where implemented.
- Protect refresh tokens and implement revocation or rotation where appropriate.
- Never log or expose passwords, OTPs, tokens, or secret configuration values.

Future Improvements

Potential enhancements include:

- Refresh token rotation and revocation
- Password reset through email verification
- Login rate limiting and brute-force protection
- Automated API tests
- API documentation with Swagger
- Structured logging and centralized error handling

Author
Ganesh A Prabhu

GitHub: https://github.com/ganesh843750-svg.
