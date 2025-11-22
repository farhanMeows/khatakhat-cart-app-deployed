# CartSync Dashboard

React web application for monitoring and managing carts in real-time.

## Features

- 🗺️ Interactive Leaflet map showing all cart locations
- 🔴 Real-time online/offline status indicators
- 📍 Live location updates via Socket.IO
- 👥 Cart management (create, edit, delete)
- 🔐 Secure admin authentication
- 📱 Responsive design

## Prerequisites

- Node.js (v14 or higher)
- Running CartSync Backend server

## Installation

1. Navigate to dashboard directory:

```bash
cd dashboard
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment:
   Edit `.env` file to match your backend URL:

```
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

## Running the Dashboard

Development mode:

```bash
npm run dev
```

The dashboard will open at `http://localhost:3000`

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Default Login

- **Username:** admin
- **Password:** admin123

(These are set on the backend. Change them in production!)

## Usage

### Login

1. Open the dashboard in your browser
2. Enter admin credentials
3. Click "Login"

### View Carts

- All carts are listed in the left sidebar
- Online carts show a green indicator
- Offline carts show a grey indicator
- Click on a cart to center the map on its location

### Create New Cart

1. Click "Create New Cart" button
2. Enter cart details:
   - Cart ID (unique identifier for the cart)
   - Password (used by cart owner to login)
   - Name (optional, friendly name)
   - Description (optional)
   - Active status (checkbox)
3. Click "Create"

### Edit Cart

1. Click "Edit" button on any cart
2. Update details as needed
3. Click "Update"

Note: You can change the password by entering a new one, or leave it blank to keep the current password.

### Delete Cart

1. Click "Delete" button on any cart
2. Confirm the deletion

### Real-time Updates

- The map automatically updates when carts send new location data
- Online/offline status changes are reflected immediately
- Connection status is shown in the sidebar header

## Map Features

- **Green markers:** Online carts
- **Grey markers:** Offline carts
- Click on any marker to see cart details:
  - Cart name and ID
  - Online/offline status
  - Last seen time
  - Coordinates
  - Location accuracy

## Technologies Used

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Navigation
- **Leaflet** - Interactive maps
- **React Leaflet** - React components for Leaflet
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **date-fns** - Date formatting

## Project Structure

```
dashboard/
├── src/
│   ├── components/
│   │   ├── Login.jsx          # Login page
│   │   ├── Dashboard.jsx      # Main dashboard container
│   │   ├── MapView.jsx        # Leaflet map component
│   │   ├── CartList.jsx       # Cart list sidebar
│   │   └── CartModal.jsx      # Create/edit cart modal
│   ├── services/
│   │   ├── api.js             # API client (Axios)
│   │   └── socket.js          # Socket.IO client
│   ├── App.jsx                # Main app component with routes
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── index.html                 # HTML template
├── vite.config.js             # Vite configuration
└── package.json               # Dependencies
```

## Troubleshooting

### Map not showing

- Check browser console for errors
- Ensure Leaflet CSS is loaded
- Check that carts have valid coordinates

### Not receiving real-time updates

- Check connection status in sidebar (green dot = connected)
- Ensure backend server is running
- Check browser console for Socket.IO errors
- Verify `VITE_SOCKET_URL` in `.env` file

### Authentication errors

- Verify backend is running
- Check `VITE_API_URL` in `.env` file
- Clear browser local storage and try again
- Verify admin credentials on backend

### CORS errors

- Ensure backend CORS is configured to allow your dashboard URL
- Check `CORS_ORIGIN` in backend `.env` file

## Production Deployment

1. Build the app:

```bash
npm run build
```

2. Deploy the `dist/` folder to your hosting service:

   - Netlify
   - Vercel
   - AWS S3 + CloudFront
   - Any static hosting service

3. Update environment variables for production:

   - Set `VITE_API_URL` to your production backend URL
   - Set `VITE_SOCKET_URL` to your production backend URL

4. Ensure your backend allows CORS from your dashboard domain

## Development Tips

- Use React DevTools for debugging
- Check browser console for errors
- Use Network tab to debug API calls
- Use Socket.IO debugging: `localStorage.debug = 'socket.io-client:socket'`

## License

MIT
