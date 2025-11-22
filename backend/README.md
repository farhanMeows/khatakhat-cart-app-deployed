# CartSync Backend

Real-time cart tracking backend server with Socket.IO for live location updates.

## Features

- 🔐 JWT Authentication (separate for carts and admins)
- 📍 Real-time location tracking via Socket.IO
- 💾 MongoDB for data persistence
- 📊 Location history tracking
- 👥 Admin dashboard for cart management
- 🔄 Automatic online/offline status detection

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

## Installation

1. Navigate to backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

```bash
cp .env.example .env
```

Edit `.env` file with your settings:

- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Strong secret key for JWT tokens
- `ADMIN_USERNAME` & `ADMIN_PASSWORD`: Default admin credentials

4. Start MongoDB (if running locally):

```bash
# macOS with Homebrew
brew services start mongodb-community

# Or manually
mongod --dbpath /path/to/data/directory
```

## Running the Server

Development mode (with auto-restart):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

#### Cart Login

```
POST /api/auth/cart/login
Body: { "cartId": "cart001", "password": "password123" }
Response: { "token": "jwt_token", "cart": {...} }
```

#### Admin Login

```
POST /api/auth/admin/login
Body: { "username": "admin", "password": "admin123" }
Response: { "token": "jwt_token", "admin": {...} }
```

### Cart Management (Admin only)

#### Get All Carts

```
GET /api/carts
Headers: { "Authorization": "Bearer <admin_token>" }
```

#### Create Cart

```
POST /api/carts
Headers: { "Authorization": "Bearer <admin_token>" }
Body: {
  "cartId": "cart001",
  "password": "password123",
  "name": "Cart 1",
  "description": "Main cart"
}
```

#### Update Cart

```
PUT /api/carts/:cartId
Headers: { "Authorization": "Bearer <admin_token>" }
Body: { "name": "Updated Name", "isActive": true }
```

#### Delete Cart

```
DELETE /api/carts/:cartId
Headers: { "Authorization": "Bearer <admin_token>" }
```

### Location Tracking

#### Update Location (Cart only)

```
POST /api/location/update
Headers: { "Authorization": "Bearer <cart_token>" }
Body: {
  "latitude": 40.7128,
  "longitude": -74.0060,
  "accuracy": 10
}
```

#### Get Location History

```
GET /api/location/history/:cartId?limit=100&startDate=2025-01-01
Headers: { "Authorization": "Bearer <token>" }
```

## Socket.IO Events

### Client → Server

- `cart-connect` - Cart identifies itself

  ```javascript
  socket.emit("cart-connect", { cartId: "cart001" });
  ```

- `admin-connect` - Admin connects to receive updates

  ```javascript
  socket.emit("admin-connect");
  ```

- `get-all-carts` - Request current cart statuses
  ```javascript
  socket.emit("get-all-carts");
  ```

### Server → Client

- `location-update` - New location update

  ```javascript
  socket.on("location-update", (data) => {
    // data: { cartId, name, location, timestamp, isOnline }
  });
  ```

- `cart-status-change` - Cart online/offline status changed

  ```javascript
  socket.on("cart-status-change", (data) => {
    // data: { cartId, isOnline, lastSeen }
  });
  ```

- `all-carts` - Response to get-all-carts request
  ```javascript
  socket.on("all-carts", (carts) => {
    // Array of all carts with their data
  });
  ```

## Database Models

### Cart

- cartId (unique)
- password (hashed)
- name
- description
- isActive
- isOnline
- lastLocation { latitude, longitude, accuracy, timestamp }
- lastSeen

### LocationHistory

- cartId
- location { latitude, longitude, accuracy }
- timestamp

### Admin

- username (unique)
- password (hashed)
- email
- role

## Default Admin Credentials

Username: `admin`
Password: `admin123`

**⚠️ Change these immediately in production!**

## Architecture

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/
│   │   ├── Cart.js              # Cart schema
│   │   ├── LocationHistory.js   # Location history schema
│   │   └── Admin.js             # Admin schema
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── carts.js             # Cart management routes
│   │   └── location.js          # Location tracking routes
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── services/
│   │   └── socketService.js     # Socket.IO setup and handlers
│   └── server.js                # Main server file
├── .env                         # Environment variables
├── .env.example                 # Example environment file
└── package.json                 # Dependencies
```

## Testing

You can test the API using tools like:

- Postman
- cURL
- Insomnia

Example cURL request:

```bash
# Admin login
curl -X POST http://localhost:5000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Create a cart (use token from login)
curl -X POST http://localhost:5000/api/carts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{"cartId":"cart001","password":"password123","name":"Test Cart"}'
```

## Production Considerations

1. **Environment Variables**: Use strong secrets and secure MongoDB URI
2. **HTTPS**: Use HTTPS in production (reverse proxy with nginx/Apache)
3. **Rate Limiting**: Add rate limiting middleware
4. **Monitoring**: Set up logging and monitoring (PM2, Winston, etc.)
5. **Backup**: Regular database backups
6. **Security**: Keep dependencies updated

## License

MIT
