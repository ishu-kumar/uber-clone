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

## User Profile

### Endpoint

`GET /users/profile`

### Description

Returns the authenticated user's profile data. Requires a valid JWT token in the request (usually via cookie or Authorization header).

### Authentication
- Requires authentication (JWT token).

### Responses

#### Success
- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "success": true,
    "data": {
      "_id": "<userId>",
      "fullname": { "firstname": "John", "lastname": "Doe" },
      "email": "john.doe@example.com",
      ...
    }
  }
  ```

#### Authentication Error
- **Status Code:** `401 Unauthorized`
- **Body:**
  ```json
  {
    "success": false,
    "message": "Authentication required"
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
- The endpoint returns the user data for the authenticated user only.
- JWT token must be provided in the request.

## User Logout

### Endpoint

`GET /users/logout`

### Description

Logs out the authenticated user by clearing the authentication token (cookie) and blacklisting the token.

### Authentication
- Requires authentication (JWT token).

### Responses

#### Success
- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "success": true,
    "message": "Logged out"
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
- The endpoint clears the authentication cookie and blacklists the token to prevent reuse.
- JWT token must be provided in the request.

# Captain Registration Endpoint Documentation

## Captain Registration

### Endpoint

`POST /captains/register`

### Description

Registers a new captain in the system. This endpoint validates the input, checks for existing captains by email, hashes the password, creates a captain with vehicle details, and returns an authentication token and captain data upon successful registration.

### Request Body

The request body must be a JSON object with the following structure:

```
{
  "fullname": {
    "firstname": "string (min 3 chars, required)",
    "lastname": "string (min 3 chars, optional)"
  },
  "email": "string (valid email, required)",
  "password": "string (min 6 chars, required)",
  "vehicle": {
    "color": "string (min 3 chars, required)",
    "plate": "string (min 3 chars, required)",
    "capacity": "integer (min 1, required)",
    "vehicleType": "string (car | motorcycle | auto, required)"
  }
}
```

#### Example

```
{
  "fullname": {
    "firstname": "Alice",
    "lastname": "Smith"
  },
  "email": "alice.smith@example.com",
  "password": "securepassword",
  "vehicle": {
    "color": "Red",
    "plate": "XYZ1234",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

### Responses

#### Success
- **Status Code:** `201 Created`
- **Body:**
  ```json
  {
    "success": true,
    "token": "<JWT token>",
    "captain": {
      "_id": "<captainId>",
      "fullname": { "firstname": "Alice", "lastname": "Smith" },
      "email": "alice.smith@example.com",
      "vehical": {
        "color": "Red",
        "plate": "XYZ1234",
        "capacity": 4,
        "vehicleType": "car"
      },
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
    "message": "Validation Failed",
    "errors": [
      { "msg": "Invalid Email", "param": "email", ... },
      { "msg": "First name must be at least 3 characters long", "param": "fullname.firstname", ... },
      { "msg": "Password must be at least 6 characters long", "param": "password", ... },
      { "msg": "Color must be at least 3 characters long", "param": "vehicle.color", ... },
      { "msg": "Plate must be at least 3 characters long", "param": "vehicle.plate", ... },
      { "msg": "Capacity must be at least 1", "param": "vehicle.capacity", ... },
      { "msg": "Invalid vehicle type", "param": "vehicle.vehicleType", ... }
    ]
  }
  ```

#### Captain Already Exists
- **Status Code:** `400 Bad Request`
- **Body:**
  ```json
  {
    "success": false,
    "message": "Captain already exist"
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
- Vehicle details are required for captain registration.
