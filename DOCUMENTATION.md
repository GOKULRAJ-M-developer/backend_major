# Hyrup Banking System - API Documentation

Comprehensive documentation for the Hyrup backend banking system API.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Authentication](#authentication)
3. [API Endpoints](#api-endpoints)
4. [Data Models](#data-models)
5. [Middleware](#middleware)
6. [Services](#services)
7. [Error Handling](#error-handling)
8. [Security Considerations](#security-considerations)

---

## Architecture Overview

The application follows a layered architecture pattern:

```
Request → Routes → Middleware → Controllers → Services → Models → Database
         ←         ←           ←           ←        ←       ←
```

### Layer Descriptions

- **Routes**: Define API endpoints and HTTP methods
- **Middleware**: Authenticate users, validate tokens, handle cookies
- **Controllers**: Business logic, request processing, response formatting
- **Services**: Utility functions (email sending, data processing)
- **Models**: Mongoose schemas, database validation rules
- **Database**: MongoDB collections

---

## Authentication

### JWT (JSON Web Tokens)

The API uses JWT for stateless authentication. Tokens are issued upon login and must be included in subsequent requests.

### Authentication Flow

1. **User Registration**
   - User provides email, name, and password
   - Password is hashed using bcrypt
   - User document created in database

2. **User Login**
   - User provides email and password
   - Password verified against stored hash
   - JWT token generated and sent to client
   - Token stored in HTTP-only cookie

3. **Protected Requests**
   - Token included in Authorization header or Cookie
   - Middleware verifies token signature and expiration
   - If valid, request proceeds; if not, 401 Unauthorized

4. **Logout**
   - Token added to blacklist
   - Cookie cleared on client side
   - Token becomes invalid for future requests

### Token Structure

```
Header: { "alg": "HS256", "typ": "JWT" }
Payload: { "userId": "...", "iat": ..., "exp": ... }
Signature: HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), SECRET)
```

---

## API Endpoints

### Base URL
```
http://localhost:5000/api
```

---

### Authentication Endpoints

#### 1. Register User
**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "securePassword123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-03-13T10:00:00Z"
  }
}
```

**Validation Rules:**
- Email must be valid and unique
- Name is required
- Password must be at least 6 characters

**Possible Errors:**
- 400: Invalid email format
- 400: Email already exists
- 400: Missing required fields
- 500: Database error

---

#### 2. Login User
**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response Headers:**
```
Set-Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Path=/
```

**Possible Errors:**
- 400: Missing email or password
- 401: Invalid credentials
- 404: User not found
- 500: Server error

---

#### 3. Logout User
**POST** `/auth/logout`

Invalidate the JWT token and end user session.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Possible Errors:**
- 401: No token provided
- 401: Invalid token
- 500: Server error

---

### Account Endpoints

All account endpoints require authentication.

#### 1. Create Account
**POST** `/accounts/`

Create a new bank account for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "accountType": "Savings",
  "currency": "USD",
  "accountNumber": "ACC001234"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Account created successfully",
  "account": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "accountNumber": "ACC001234",
    "accountType": "Savings",
    "currency": "USD",
    "balance": 0,
    "createdAt": "2024-03-13T10:00:00Z",
    "status": "Active"
  }
}
```

**Possible Errors:**
- 401: Unauthorized (no token)
- 400: Invalid request body
- 400: Account number already exists
- 500: Server error

---

#### 2. Get User Accounts
**GET** `/accounts/`

Retrieve all accounts belonging to the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Accounts retrieved successfully",
  "accounts": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "userId": "507f1f77bcf86cd799439011",
      "accountNumber": "ACC001234",
      "accountType": "Savings",
      "currency": "USD",
      "balance": 5000,
      "status": "Active",
      "createdAt": "2024-03-13T10:00:00Z"
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "userId": "507f1f77bcf86cd799439011",
      "accountNumber": "ACC001235",
      "accountType": "Checking",
      "currency": "USD",
      "balance": 2500,
      "status": "Active",
      "createdAt": "2024-03-13T11:00:00Z"
    }
  ]
}
```

**Possible Errors:**
- 401: Unauthorized
- 500: Server error

---

#### 3. Get Account Balance
**GET** `/accounts/balance/:accountId`

Retrieve the current balance of a specific account.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `accountId` (required): MongoDB ObjectId of the account

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Balance retrieved successfully",
  "account": {
    "_id": "507f1f77bcf86cd799439012",
    "accountNumber": "ACC001234",
    "balance": 5000,
    "currency": "USD",
    "lastUpdated": "2024-03-13T10:30:00Z"
  }
}
```

**Possible Errors:**
- 401: Unauthorized
- 404: Account not found
- 400: Invalid account ID format
- 500: Server error

---

### Transaction Endpoints

All transaction endpoints require authentication.

#### 1. Create Transaction
**POST** `/transactions/`

Record a new transaction (transfer, deposit, withdrawal).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "fromAccount": "507f1f77bcf86cd799439012",
  "toAccount": "507f1f77bcf86cd799439013",
  "amount": 1000,
  "type": "transfer",
  "description": "Payment for services",
  "reference": "REF123456"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Transaction created successfully",
  "transaction": {
    "_id": "507f1f77bcf86cd799439014",
    "fromAccount": {
      "_id": "507f1f77bcf86cd799439012",
      "accountNumber": "ACC001234",
      "balance": 4000
    },
    "toAccount": {
      "_id": "507f1f77bcf86cd799439013",
      "accountNumber": "ACC001235",
      "balance": 3500
    },
    "amount": 1000,
    "type": "transfer",
    "description": "Payment for services",
    "reference": "REF123456",
    "status": "completed",
    "timestamp": "2024-03-13T10:30:00Z"
  }
}
```

**Transaction Types:**
- `transfer`: Transfer between accounts
- `deposit`: Add funds to account
- `withdrawal`: Withdraw funds from account
- `fee`: Account fee deduction

**Possible Errors:**
- 401: Unauthorized
- 400: Invalid request body
- 400: Insufficient funds
- 404: Account not found
- 422: Invalid transaction
- 500: Server error

---

#### 2. Create Initial Funds Transaction
**POST** `/transactions/system/initial-funds`

System-only endpoint to create initial funds for an account (admin/system user only).

**Headers:**
```
Authorization: Bearer <system-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "accountId": "507f1f77bcf86cd799439012",
  "amount": 10000,
  "description": "Initial account funding"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Initial funds transaction created",
  "transaction": {
    "_id": "507f1f77bcf86cd799439015",
    "toAccount": "507f1f77bcf86cd799439012",
    "amount": 10000,
    "type": "initial_funds",
    "description": "Initial account funding",
    "status": "completed",
    "timestamp": "2024-03-13T10:00:00Z"
  }
}
```

**Possible Errors:**
- 401: Unauthorized
- 403: Forbidden (not a system user)
- 404: Account not found
- 500: Server error

---

## Data Models

### User Schema

```javascript
{
  email: String (unique, required, lowercase),
  name: String (required),
  password: String (required, hashed, min 6 chars),
  systemUser: Boolean (default: false, immutable),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Validations:**
- Email must match valid email regex
- Password must be at least 6 characters
- Email must be unique

---

### Account Schema

```javascript
{
  userId: ObjectId (required, ref: User),
  accountNumber: String (required, unique),
  accountType: String (enum: ["Savings", "Checking", "Business"]),
  currency: String (default: "USD"),
  balance: Number (default: 0),
  status: String (enum: ["Active", "Frozen", "Closed"], default: "Active"),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

### Transaction Schema

```javascript
{
  fromAccount: ObjectId (ref: Account),
  toAccount: ObjectId (ref: Account),
  amount: Number (required, > 0),
  type: String (enum: ["transfer", "deposit", "withdrawal", "fee"]),
  description: String,
  reference: String,
  status: String (enum: ["pending", "completed", "failed"], default: "completed"),
  createdBy: ObjectId (ref: User),
  metadata: Object,
  createdAt: Date (auto)
}
```

---

### Ledger Schema

```javascript
{
  accountId: ObjectId (ref: Account),
  transactionId: ObjectId (ref: Transaction),
  type: String (enum: ["credit", "debit"]),
  amount: Number,
  balanceBefore: Number,
  balanceAfter: Number,
  description: String,
  createdAt: Date (auto)
}
```

**Purpose**: Maintains immutable audit trail of all account balance changes.

---

### BlackList Schema

```javascript
{
  token: String (required, unique),
  userId: ObjectId (ref: User),
  expiresAt: Date,
  createdAt: Date (auto)
}
```

**Purpose**: Stores invalidated JWT tokens for logout functionality.

---

## Middleware

### Authentication Middleware (`auth.middleware.js`)

#### `authMiddleware`
Verifies JWT token and attaches user information to request.

**Function Signature:**
```javascript
authMiddleware(req, res, next)
```

**Flow:**
1. Extracts token from Authorization header or cookies
2. Verifies token signature and expiration
3. Checks if token is blacklisted
4. Attaches `req.user` and `req.userId` to request
5. Calls `next()` to continue or sends 401 error

**Error Responses:**
- 401: No token provided
- 401: Invalid or expired token
- 401: Token has been invalidated

**Usage:**
```javascript
router.post("/", authMiddleware.authMiddleware, controller.handler)
```

---

#### `authMiddleware.authSystemUserMiddleware`
Verifies user is a system user (admin).

**Requirements:**
- Valid JWT token
- `systemUser: true` in user document

**Error Responses:**
- 401: Not authenticated
- 403: Not a system user

**Usage:**
```javascript
router.post("/system/endpoint", authMiddleware.authSystemUserMiddleware, controller.handler)
```

---

## Services

### Email Service (`email.service.js`)

Handles sending email notifications using Nodemailer with Gmail OAuth 2.0.

**Features:**
- Gmail OAuth 2.0 integration for secure authentication
- HTML and plain text support
- Attachment support
- Error handling and logging
- Automatic token refresh handling

**Environment Variables Required:**
- `OAUTH_CLIENT_ID`: Google OAuth Client ID
- `OAUTH_CLIENT_SECRET`: Google OAuth Client Secret
- `OAUTH_REFRESH_TOKEN`: Google OAuth Refresh Token
- `EMAIL_USER`: Gmail address to send from

**Setup Process:**
1. Create a project in Google Cloud Console
2. Enable Gmail API
3. Generate OAuth 2.0 credentials
4. Authorize the application to get refresh token
5. Store credentials in `.env` file

**Usage Example:**
```javascript
import emailService from './email.service.js';

await emailService.sendEmail({
  to: 'user@example.com',
  subject: 'Transaction Confirmation',
  html: '<h1>Transaction Completed</h1><p>Amount: $1000</p>',
  text: 'Transaction Completed. Amount: $1000'
});
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successful request |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 422 | Unprocessable Entity | Invalid transaction logic |
| 500 | Server Error | Unexpected error |

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "errorCode": "ERROR_TYPE",
  "details": "Additional information"
}
```

---

## Security Considerations

### Password Security

- Passwords are hashed using bcrypt with salt rounds (typically 10)
- Never store plain text passwords
- Use strong password validation rules
- Implement password reset with secure token

### JWT Security

- Use strong, unique JWT secret key
- Set appropriate token expiration (typically 24 hours)
- Store tokens in HTTP-only cookies to prevent XSS attacks
- Implement token refresh mechanism for long sessions
- Blacklist tokens on logout

### Data Protection

- Validate and sanitize all user inputs
- Use MongoDB query injection protection
- Implement rate limiting to prevent brute force attacks
- Use HTTPS in production
- Enable CORS with appropriate origins

### Database

- Use environment variables for connection strings
- Never commit `.env` file to version control
- Implement database backups
- Use database-level access controls
- Enable MongoDB authentication

### API Security

- Implement request validation middleware
- Use helmet.js for HTTP headers security
- Add rate limiting middleware
- Implement CORS correctly
- Use API versioning for backward compatibility

---

## Development Best Practices

### Code Organization

```
src/
├── controllers/  # Business logic
├── models/       # Database schemas
├── middleware/   # Request processing
├── routes/       # API endpoints
├── services/     # Utilities
└── config/       # Configuration
```

### Error Handling Pattern

```javascript
try {
  // Perform action
  const result = await Model.findById(id);
  if (!result) {
    return res.status(404).json({ 
      success: false, 
      message: "Resource not found" 
    });
  }
  res.json({ success: true, data: result });
} catch (error) {
  console.error("Error:", error);
  res.status(500).json({ 
    success: false, 
    message: "Server error" 
  });
}
```

### Async/Await Pattern

```javascript
// Use async/await instead of promises
const getUserAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.userId });
    res.json({ success: true, accounts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
```

---

## Testing Endpoints

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Create Account (with token):**
```bash
curl -X POST http://localhost:5000/api/accounts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"accountType":"Savings","currency":"USD","accountNumber":"ACC123"}'
```

### Using Postman

1. Create collection for the API
2. Set base URL: `http://localhost:5000/api`
3. Configure authentication type: Bearer Token
4. Add token variable for reuse across requests
5. Save request examples for each endpoint

---

## Troubleshooting

### Common Issues

**Database Connection Error**
- Verify MongoDB URI in `.env`
- Check network connectivity to MongoDB server
- Ensure IP whitelist includes your machine (for MongoDB Atlas)

**JWT Token Errors**
- Verify JWT_SECRET is set in `.env`
- Check token expiration time
- Ensure token format is correct (Bearer scheme)

**Email Not Sending**
- Verify OAuth credentials in `.env` (CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN)
- Check that Gmail API is enabled in Google Cloud Console
- Verify refresh token is valid (tokens expire after 6 months of inactivity)
- Ensure sender email address matches the one authorized in OAuth setup
- Check email service logs for detailed error messages

**CORS Errors**
- Configure CORS middleware in app.js
- Verify frontend URL is whitelisted
- Check HTTP methods are allowed

---

## Deployment Considerations

- Use environment variables for all sensitive data
- Set NODE_ENV to production
- Use reverse proxy (Nginx) for production
- Implement monitoring and logging
- Use PM2 or similar for process management
- Enable database replication for high availability
- Implement backup and disaster recovery plan
- Use CDN for static assets
- Implement API rate limiting in production
- Use APM tools for performance monitoring

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-03-13 | Initial release |

---

**Last Updated**: March 13, 2024
