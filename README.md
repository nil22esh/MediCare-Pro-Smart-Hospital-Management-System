# MediCare-Pro-Smart-Hospital-Management-System

# User Management API

This API provides endpoints for managing users in a secure and scalable manner. It includes features such as user registration, authentication, profile updates, and administrative actions like listing all users and deleting specific users. JWT is used for authentication, and access to protected routes is restricted based on user roles.

---

## 🔐 POST `/api/users/register`

### 📌 User Registration

Registers a new user and returns a JWT token.

**Body Parameters:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "gender": "male",
  "dob": "1995-01-01",
  "role": "patient"
}
```

**Success Response:**

```json
{
  "sucess": true,
  "message": "User registered successfully!",
  "user": { ... },
  "token": "<jwt-token>"
}
```

---

## 🔐 POST `/api/users/login`

### 📌 User Login

Logs in a user and returns a JWT token.

**Body Parameters:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response:**

```json
{
  "sucess": true,
  "message": "User logged in successfully!",
  "user": { ... },
  "token": "<jwt-token>"
}
```

---

## 🔐 POST `/api/users/logout`

### 📌 Logout User

Clears the JWT token cookie to logout user.

**Headers:**

- Requires Authorization JWT Token (via cookie)

**Success Response:**

```json
{
  "success": true,
  "message": "User logged out successfully"
}
```

---

## 🔐 GET `/api/users/get-user/:id`

### 📌 Get User By ID

Returns user details by user ID.

**Headers:**

- Requires Authorization JWT Token

**Success Response:**

```json
{
  "success": true,
  "message": "User fetched successfully",
  "user": { ... }
}
```

---

## 🔐 PUT `/api/users/update-user-profile`

### 📌 Update User Profile

Updates the current logged-in user's profile.

**Headers:**

- Requires Authorization JWT Token

**Body Parameters (any or all):**

```json
{
  "name": "Updated Name",
  "phone": "9876543210",
  "dob": "1990-01-01",
  "role": "doctor",
  "address": "New Address"
}
```

**Success Response:**

```json
{
  "success": true,
  "message": "User updated successfully!",
  "user": { ... }
}
```

---

## 🔐 GET `/api/users/get-all-users`

### 📌 Get All Users

Fetches a list of all users. Only accessible by admin users.

**Headers:**

- Requires Authorization JWT Token (admin only)

**Success Response:**

```json
{
  "success": true,
  "message": "Users fetched successfully",
  "users": [ ... ]
}
```

---

## 🔐 DELETE `/api/users/delete-user/:id`

### 📌 Delete User By ID

Deletes a user by ID. Only accessible by admin users.

**Headers:**

- Requires Authorization JWT Token (admin only)

**Success Response:**

```json
{
  "success": true,
  "message": "User deleted successfully",
  "user": { ... }
}
```

---

## 🔐 Authentication Middleware

- JWT Auth is required on all private endpoints.
- Admin-only routes are protected using `checkIsAdmin` middleware.

---

## 🛡️ Security & Best Practices

- Passwords are hashed using `bcrypt`.
- JWT tokens are stored as HttpOnly cookies for added security.
- Validation is added for email, password, and user fields.

---

## 🧠 Technologies Used

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt for hashing passwords

---

## 📁 Folder Structure Overview

```
user.routes.js         // Defines all user-related routes
user.controller.js     // Business logic for each user action
user.model.js          // MongoDB schema and methods for user
middlewares/           // JWT and Admin checks
```

---

## ✍️ Author

Made with ❤️ by your dev team

---
