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

# 🩺 Doctor Management API

This API is part of a full-stack Hospital Management System and is responsible for managing doctor profiles, their availability, and their assignments. It includes functionality for creating, reading, updating, and deleting doctor profiles, accessible based on role-based authentication (Doctor/Admin).

---

## 📁 Doctor Profile Endpoints

---

### ▶️ `POST /create-doctor-profile`

**🔹 Description:**  
Create a new doctor profile. Only accessible by authenticated users with the **Doctor** role.

**🔸 Body Parameters:**

```json
{
  "specialization": "Cardiologist",
  "qualifications": ["MBBS", "MD"],
  "experience": 5,
  "department": "Cardiology",
  "availableSlots": [
    {
      "date": "2025-04-15",
      "time": "10:00 AM"
    }
  ]
}
```

**✅ Success Response:**

```json
{
  "success": true,
  "message": "Doctor profile created successfully",
  "data": {
    /* created doctor object */
  }
}
```

---

### 📥 `GET /all-doctors`

**🔹 Description:**  
Fetches all doctor profiles. Only accessible by **Admin** users.

**🔸 Body Parameters:**  
_None_

**✅ Success Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "specialization": "Dermatologist",
      "experience": 4,
      "department": "Skin Care"
    }
  ]
}
```

---

### 📥 `GET /doctor-profile/:doctorId`

**🔹 Description:**  
Fetch a doctor’s profile using their ID. Accessible by authenticated **Doctor** users.

**🔸 URL Params:**  
`doctorId` – ID of the doctor

**✅ Success Response:**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "specialization": "Neurologist",
    "experience": 10
  }
}
```

---

### 🔄 `PUT /update-profile/:doctorId`

**🔹 Description:**  
Update an existing doctor profile. Only accessible by the **Doctor** themselves.

**🔸 URL Params:**  
`doctorId` – ID of the doctor

**🔸 Body Parameters:** _(any of the following fields can be updated)_

```json
{
  "qualifications": ["MBBS", "MD", "DM"],
  "experience": 8,
  "status": "off-duty"
}
```

**✅ Success Response:**

```json
{
  "success": true,
  "message": "Doctor profile updated successfully",
  "data": {
    /* updated doctor object */
  }
}
```

---

### ❌ `DELETE /delete-profile/:doctorId`

**🔹 Description:**  
Deletes a doctor profile. Only accessible by **Admin** users.

**🔸 URL Params:**  
`doctorId` – ID of the doctor to delete

**✅ Success Response:**

```json
{
  "success": true,
  "message": "Doctor profile deleted successfully"
}
```

---

# 🏥 Patient Management API - Hospital Management System

This module handles the **Patient-related functionality** of the Hospital Management System. It allows for the registration, updating, and retrieval of patient information with role-based access control.

---

## 🧾 API Endpoints

### 1. **Add Patient**

- **Route**: `POST /add-patient`
- **Access**: Authenticated User with Patient Role
- **Middleware**: `jwtAuth`, `checkIsPatient`
- **Body Parameters**:
  ```json
  {
    "userId": "ObjectId",
    "bloodGroup": "A+",
    "emergencyContact": {
      "name": "John Doe",
      "relation": "Brother",
      "phone": "1234567890"
    },
    "allergies": ["Peanuts", "Dust"],
    "healthHistory": ["Asthma"],
    "currentMedications": ["Inhaler"],
    "insuranceDetails": {
      "provider": "ABC Insurance",
      "policyNumber": "XYZ123456",
      "validTill": "2025-12-31"
    }
  }
  ```

---

### 2. **Get All Patients**

- **Route**: `GET /get-all-patients`
- **Access**: Admin only
- **Middleware**: `jwtAuth`, `checkIsAdmin`

---

### 3. **Get Patient By ID**

- **Route**: `GET /get-patient/:id`
- **Access**: Authenticated Patient
- **Middleware**: `jwtAuth`, `checkIsPatient`
- **Params**:
  - `id`: Patient ObjectId

---

### 4. **Update Patient Profile**

- **Route**: `PUT /update-patient/:id`
- **Access**: Authenticated Patient
- **Middleware**: `jwtAuth`, `checkIsPatient`
- **Params**:
  - `id`: Patient ObjectId
- **Body**: Any subset of patient schema fields to be updated

---

## 🔐 Authentication Middleware

- JWT Auth is required on all private endpoints.
- Admin-only routes are protected using `checkIsAdmin` middleware.
- Ensures the authenticated user has a "Doctor" role using `checkIsDoctor` middleware.
- Grants access only to users with "Patient" role using `checkIsPatient` middleware.

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
