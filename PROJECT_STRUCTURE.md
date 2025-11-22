# CartSync Project Structure

```
khatakhat cart app/
│
├── README.md                          # Main project documentation
├── QUICKSTART.md                      # Quick start guide
│
├── backend/                           # Backend Server (Node.js + Express + Socket.IO)
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js           # MongoDB connection & initialization
│   │   ├── models/
│   │   │   ├── Cart.js               # Cart schema (cartId, password, location, etc.)
│   │   │   ├── LocationHistory.js    # Location history schema
│   │   │   └── Admin.js              # Admin user schema
│   │   ├── routes/
│   │   │   ├── auth.js               # POST /api/auth/cart/login, /api/auth/admin/login
│   │   │   ├── carts.js              # GET/POST/PUT/DELETE /api/carts
│   │   │   └── location.js           # POST /api/location/update, GET /api/location/history/:cartId
│   │   ├── middleware/
│   │   │   └── auth.js               # JWT authentication middleware
│   │   ├── services/
│   │   │   └── socketService.js      # Socket.IO event handlers
│   │   └── server.js                 # Main server file
│   ├── .env                          # Environment variables (PORT, MONGODB_URI, JWT_SECRET)
│   ├── .env.example                  # Example environment file
│   ├── package.json                  # Dependencies (express, socket.io, mongoose, etc.)
│   └── README.md                     # Backend documentation
│
├── dashboard/                         # Admin Dashboard (React + Vite + Leaflet)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx             # Admin login page
│   │   │   ├── Dashboard.jsx         # Main dashboard container
│   │   │   ├── MapView.jsx           # Leaflet map with cart markers
│   │   │   ├── CartList.jsx          # Sidebar cart list
│   │   │   └── CartModal.jsx         # Create/edit cart modal
│   │   ├── services/
│   │   │   ├── api.js                # Axios API client
│   │   │   └── socket.js             # Socket.IO client
│   │   ├── App.jsx                   # Main app component with routes
│   │   ├── main.jsx                  # Entry point
│   │   └── index.css                 # Global styles
│   ├── index.html                    # HTML template
│   ├── vite.config.js                # Vite configuration
│   ├── .env                          # Environment variables (VITE_API_URL, VITE_SOCKET_URL)
│   ├── package.json                  # Dependencies (react, leaflet, socket.io-client, etc.)
│   └── README.md                     # Dashboard documentation
│
└── mobile/                            # Mobile Apps
    └── cartsync/                      # React Native CLI App for Cart Owners
        ├── android/                   # Android native code
        │   └── app/src/main/
        │       └── AndroidManifest.xml # Android permissions
        ├── ios/                       # iOS native code
        ├── src/
        │   ├── config/
        │   │   └── constants.js       # API_URL, intervals, location options
        │   ├── services/
        │   │   ├── api.js             # Axios API client (login, location update)
        │   │   ├── socket.js          # Socket.IO client
        │   │   ├── locationService.js # GPS location tracking
        │   │   ├── backgroundService.js # Background location updates
        │   │   └── notificationService.js # Push notifications
        │   └── screens/
        │       ├── LoginScreen.js     # Cart owner login
        │       └── HomeScreen.js      # Main tracking screen with toggle
        ├── App.js                     # Main app component with navigation
        ├── index.js                   # Entry point
        ├── app.json                   # App metadata
        ├── package.json               # Dependencies (react-native, geolocation, etc.)
        └── README.md                  # Mobile app documentation
```

## 🔑 Key Files Explained

### Backend

| File                   | Purpose                                                  |
| ---------------------- | -------------------------------------------------------- |
| `server.js`            | Main Express server, Socket.IO setup, route mounting     |
| `database.js`          | MongoDB connection, creates default admin user           |
| `Cart.js`              | Cart model with password hashing, location tracking      |
| `auth.js` (routes)     | Login endpoints for carts and admins                     |
| `carts.js` (routes)    | CRUD operations for cart management                      |
| `location.js` (routes) | Location update and history endpoints                    |
| `socketService.js`     | Real-time event handlers (cart-connect, location-update) |
| `auth.js` (middleware) | JWT verification, protects routes                        |

### Dashboard

| File            | Purpose                                            |
| --------------- | -------------------------------------------------- |
| `Login.jsx`     | Admin authentication form                          |
| `Dashboard.jsx` | Main container, manages state, Socket.IO listeners |
| `MapView.jsx`   | Leaflet map, renders cart markers, popups          |
| `CartList.jsx`  | Sidebar showing all carts, online/offline status   |
| `CartModal.jsx` | Form to create/edit carts                          |
| `api.js`        | Axios setup, JWT interceptor, API methods          |
| `socket.js`     | Socket.IO client, event emitters/listeners         |

### Mobile App

| File                     | Purpose                                              |
| ------------------------ | ---------------------------------------------------- |
| `LoginScreen.js`         | Cart owner login form                                |
| `HomeScreen.js`          | Main screen with tracking toggle, status display     |
| `locationService.js`     | GPS location tracking, permissions                   |
| `backgroundService.js`   | Background task for periodic updates                 |
| `notificationService.js` | Local notification management                        |
| `api.js`                 | API client for login and location updates            |
| `socket.js`              | Socket.IO connection for real-time communication     |
| `constants.js`           | Configuration (API URL, intervals, location options) |

## 🔄 Data Flow

### Location Update Flow

```
1. Mobile App (GPS)
   └─> Gets current location
       └─> Sends to Backend API
           POST /api/location/update
           { latitude, longitude, accuracy }

2. Backend Server
   └─> Validates JWT token
   └─> Updates Cart.lastLocation in MongoDB
   └─> Saves to LocationHistory
   └─> Broadcasts via Socket.IO
       emit('location-update', cartData)

3. Admin Dashboard
   └─> Receives Socket.IO event
   └─> Updates cart state
   └─> Map marker moves to new position
```

### Authentication Flow

```
1. Login Request
   POST /api/auth/cart/login or /api/auth/admin/login
   { cartId/username, password }

2. Backend Validates
   └─> Finds user in MongoDB
   └─> Compares password (bcrypt)
   └─> Generates JWT token
   └─> Returns token + user data

3. Client Stores Token
   └─> Mobile: AsyncStorage
   └─> Dashboard: localStorage
   └─> Adds to Authorization header for future requests
```

## 📦 Dependencies Summary

### Backend

- **express** - Web framework
- **socket.io** - Real-time communication
- **mongoose** - MongoDB ODM
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **cors** - Cross-origin resource sharing

### Dashboard

- **react** - UI library
- **react-leaflet** - Map components
- **socket.io-client** - Real-time client
- **axios** - HTTP client
- **react-router-dom** - Routing
- **react-toastify** - Notifications

### Mobile App

- **react-native** - Mobile framework
- **react-native-geolocation-service** - GPS tracking
- **react-native-background-actions** - Background tasks
- **socket.io-client** - Real-time client
- **@react-native-async-storage/async-storage** - Local storage
- **react-native-push-notification** - Notifications
- **@react-navigation/native** - Navigation

## 🚀 Startup Order

1. **MongoDB** - Must be running first
2. **Backend** - Connects to MongoDB, starts on port 5000
3. **Dashboard** - Connects to backend, opens on port 3000
4. **Mobile App** - Connects to backend (configured API_URL)

## 🔧 Configuration Files

| File                                      | Purpose                                          |
| ----------------------------------------- | ------------------------------------------------ |
| `backend/.env`                            | Backend configuration (ports, database, secrets) |
| `dashboard/.env`                          | Dashboard API endpoints                          |
| `mobile/cartsync/src/config/constants.js` | Mobile API URL and settings                      |

## 📝 Important Notes

- **Default Admin**: username: `admin`, password: `admin123` (change in production!)
- **JWT Token**: Stored in localStorage (dashboard) or AsyncStorage (mobile)
- **Location Updates**: Every 30 seconds (configurable)
- **Notification Reminders**: Every 30 minutes (configurable)
- **Socket.IO Events**:
  - `cart-connect` - Cart identifies itself
  - `admin-connect` - Admin connects
  - `location-update` - New location broadcast
  - `cart-status-change` - Online/offline status
  - `get-all-carts` - Request all cart data

## 🎯 Quick Commands

```bash
# Start Backend
cd backend && npm run dev

# Start Dashboard
cd dashboard && npm run dev

# Start Mobile (Android)
cd mobile/cartsync && npm run android

# Start Mobile (iOS)
cd mobile/cartsync && npm run ios
```

---

For detailed setup instructions, see `QUICKSTART.md`  
For complete documentation, see `README.md`  
For component-specific docs, see each folder's `README.md`
