# User Registration & Login Endpoint Documentation

## User Registration

### Endpoint

`POST /users/register`

### Description

Registers a new user in the system. This endpoint validates the input, hashes the password, creates a user, and returns an authentication token upon successful registration.

### Request Body

The request body must be a JSON object with the following structure:

```
{
  "fullname": {
    "firstname": "string (min 3 chars, required)",
    "lastname": "string (optional)"
  },
  "email": "string (valid email, required)",
  "password": "string (min 3 chars, required)"
}
```

#### Example

```
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "yourpassword"
}
```

### Responses

#### Success
- **Status Code:** `201 Created`
- **Body:**
  ```json
  {
    "success": true,
    "token": "<JWT token>"
  }
  ```

#### Validation Error
- **Status Code:** `400 Bad Request`
- **Body:**
  ```json
  {
    "success": false,
    "errors": [
      { "msg": "Invalid Email", "param": "email", ... },
      { "msg": "First name must be at least 3 chracters long", "param": "fullname.firstname", ... },
      { "msg": "Password must be at least 6 chracters long", "param": "password", ... }
    ]
  }
  ```

#### Other Errors
- **Status Code:** `500 Internal Server Error`
- **Body:**
  ```json
  {
    "success": false,
    "message": "Error message"
  }
  ```

### Notes
- The password is securely hashed before storage.
- The returned token is a JWT for authentication in subsequent requests.
- All required fields must be provided and valid for successful registration.

## User Login

### Endpoint

`POST /users/login`

### Description

Authenticates a user with email and password. Returns a JWT token and user data on successful login.

### Request Body

The request body must be a JSON object with the following structure:

```
{
  "email": "string (valid email, required)",
  "password": "string (min 6 chars, required)"
}
```

#### Example

```
{
  "email": "john.doe@example.com",
  "password": "yourpassword"
}
```

### Responses

#### Success
- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "token": "<JWT token>",
    "user": {
      "_id": "<userId>",
      "fullname": { "firstname": "John", "lastname": "Doe" },
      "email": "john.doe@example.com",
      ...
    }
  }
  ```

#### Validation Error
- **Status Code:** `400 Bad Request`
- **Body:**
  ```json
  {
    "success": false,
    "errors": [
      { "msg": "Invalid Email", "param": "email", ... },
      { "msg": "Password must be at least 6 chracters long", "param": "password", ... }
    ]
  }
  ```

#### Authentication Error
- **Status Code:** `401 Unauthorized`
- **Body:**
  ```json
  {
    "success": false,
    "message": "Invalid email or password"
  }
  ```

#### Other Errors
- **Status Code:** `500 Internal Server Error`
- **Body:**
  ```json
  {
    "success": false,
    "message": "Error message"
  }
  ```

### Notes
- The password must be at least 6 characters long.
- Returns a JWT token for authentication in subsequent requests.
- The user object contains user details except the password.
