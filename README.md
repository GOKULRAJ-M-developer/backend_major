# Hyrup Backend - Banking System API

A Node.js Express backend for a banking/financial management system with user authentication, account management, and transaction handling.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Documentation](#documentation)

## Features

- **User Authentication**: Secure registration, login, and logout with JWT tokens
- **Account Management**: Create and manage multiple bank accounts
- **Transaction Processing**: Record and track financial transactions
- **Balance Tracking**: Real-time account balance updates with ledger system
- **Email Notifications**: Integrated email service for notifications
- **Role-Based Access**: Support for system users and regular users
- **Security**: Password hashing with bcrypt, JWT authentication, request validation

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js 5.x
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcrypt, cookie-parser
- **Email**: Nodemailer with Gmail OAuth 2.0
- **Environment**: dotenv for configuration
- **Development**: Nodemon for hot reload

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance - MongoDB Atlas)
- npm or yarn package manager
- Gmail account with OAuth 2.0 configured (for email service)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend_major
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Database
MONGO_URI=your_mongo_uri

# JWT
JWT_SECRET=your_jwt_secret_key

# Email Configuration (Gmail OAuth 2.0)
OAUTH_CLIENT_ID=your-client-id.apps.googleusercontent.com
OAUTH_CLIENT_SECRET=your-client-secret
OAUTH_REFRESH_TOKEN=your-refresh-token
EMAIL_USER=your-email@gmail.com

# Server Port (optional, defaults to 5000)
PORT=5000
```

### Email Setup Instructions

For Gmail with OAuth 2.0:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project for your application
3. Enable the Gmail API for the project
4. Go to "Credentials" and create an OAuth 2.0 Client ID (Web application)
5. Set authorized redirect URIs to your callback URL
6. Download the client credentials JSON file
7. Use the OAuth tokens in your `.env` file:
   - `OAUTH_CLIENT_ID`: Your client ID
   - `OAUTH_CLIENT_SECRET`: Your client secret
   - `OAUTH_REFRESH_TOKEN`: Refresh token from authorization flow
8. Alternative: If using service account, upload your service account JSON credentials and reference the path in `.env`

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

The server will start on `http://localhost:5000`

### Production Mode
```bash
node server.js
```

## API Endpoints

### Authentication Routes (`/api/auth`)
- **POST** `/register` - Register a new user
- **POST** `/login` - Login user and receive JWT token
- **POST** `/logout` - Logout user

### Account Routes (`/api/accounts`)
- **POST** `/` - Create a new account (requires authentication)
- **GET** `/` - Get all user accounts (requires authentication)
- **GET** `/balance/:accountId` - Get account balance (requires authentication)

### Transaction Routes (`/api/transactions`)
- **POST** `/` - Create a transaction (requires authentication)
- **POST** `/system/initial-funds` - Create initial funds transaction (system user only)

## Project Structure

```
backend_major/
├── src/
│   ├── app.js                    # Express app configuration
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── account.controller.js # Account logic
│   │   ├── transaction.controller.js # Transaction logic
│   │   └── user.auth.controller.js # Authentication logic
│   ├── middleware/
│   │   └── auth.middleware.js    # JWT verification
│   ├── models/
│   │   ├── user.model.js         # User schema
│   │   ├── account.model.js      # Account schema
│   │   ├── transaction.model.js  # Transaction schema
│   │   ├── ledger.model.js       # Ledger schema
│   │   └── blackList.model.js    # Token blacklist schema
│   ├── routes/
│   │   ├── auth.route.js         # Auth endpoints
│   │   ├── account.route.js      # Account endpoints
│   │   └── transaction.route.js  # Transaction endpoints
│   └── services/
│       └── email.service.js      # Email sending service
├── server.js                      # Server entry point
├── package.json                   # Dependencies
├── .env                           # Environment variables
└── README.md                      # This file
```

## Documentation

For detailed API documentation, request/response examples, and implementation details, see [DOCUMENTATION.md](./DOCUMENTATION.md).

## Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| express | 5.2.1 | Web framework |
| mongoose | 9.2.4 | MongoDB ODM |
| jsonwebtoken | 9.0.3 | JWT authentication |
| bcrypt | 6.0.0 | Password hashing |
| nodemailer | 8.0.2 | Email service |
| dotenv | 17.3.1 | Environment management |
| cookie-parser | 1.4.7 | Cookie parsing |

## Development Notes

- Uses ES Modules (import/export syntax)
- Implemented JWT middleware for protected routes
- Token blacklist system for logout functionality
- Ledger-based transaction recording for accurate balance tracking
- Email notifications for important account events

## Future Enhancements

- Add request validation middleware
- Implement rate limiting
- Add comprehensive error logging
- Create test suite (unit and integration tests)
- Add API documentation with Swagger/OpenAPI
- Implement transaction pagination
- Add transaction history filtering
- Implement account freezing/deactivation

## Support

For issues or questions, please check the DOCUMENTATION.md file or open an issue in the repository.

## License

ISC
