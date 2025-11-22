# CartSync Setup Checklist

Use this checklist to ensure CartSync is properly set up and working.

## 📋 Pre-Setup Requirements

### Software Installation

- [ ] Node.js v18+ installed (`node -v` to check)
- [ ] npm installed (`npm -v` to check)
- [ ] MongoDB installed and accessible
- [ ] Git installed (optional, for version control)

### For Mobile Development

- [ ] Android Studio installed (for Android)
- [ ] Android SDK installed
- [ ] Android device/emulator ready
- [ ] Xcode installed (for iOS, macOS only)
- [ ] CocoaPods installed (for iOS, `pod --version`)
- [ ] iOS device/simulator ready

### Development Tools (Optional but Recommended)

- [ ] VS Code or preferred IDE
- [ ] Postman or similar (for API testing)
- [ ] MongoDB Compass (for database visualization)
- [ ] React DevTools browser extension

---

## 🔧 Backend Setup

### Installation

- [ ] Navigate to `backend/` directory
- [ ] Run `npm install`
- [ ] All dependencies installed without errors

### Configuration

- [ ] `.env` file created (copy from `.env.example`)
- [ ] `MONGODB_URI` configured correctly
- [ ] `JWT_SECRET` set (change from default)
- [ ] `ADMIN_USERNAME` set
- [ ] `ADMIN_PASSWORD` set (change from default)
- [ ] `PORT` configured (default 5000)
- [ ] `CORS_ORIGIN` set to dashboard URL

### Database

- [ ] MongoDB service is running
- [ ] Can connect to MongoDB (`mongosh`)
- [ ] Database `cartsync` will be auto-created

### Testing

- [ ] Run `npm run dev`
- [ ] Server starts without errors
- [ ] See: "CartSync Backend Server running on port 5000"
- [ ] See: "MongoDB Connected"
- [ ] See: "Socket.IO ready"
- [ ] Open `http://localhost:5000` in browser
- [ ] See API status message

### API Testing (Optional)

- [ ] Test admin login endpoint
  ```bash
  curl -X POST http://localhost:5000/api/auth/admin/login \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"admin123"}'
  ```
- [ ] Receive JWT token in response
- [ ] Test creating a cart (use token from above)

---

## 💻 Dashboard Setup

### Installation

- [ ] Navigate to `dashboard/` directory
- [ ] Run `npm install`
- [ ] All dependencies installed without errors

### Configuration

- [ ] `.env` file exists
- [ ] `VITE_API_URL` points to backend (default: http://localhost:5000)
- [ ] `VITE_SOCKET_URL` points to backend (default: http://localhost:5000)

### Testing

- [ ] Backend is running
- [ ] Run `npm run dev`
- [ ] Dashboard starts without errors
- [ ] Browser opens at `http://localhost:3000`
- [ ] Login page displays correctly
- [ ] Can login with admin credentials
- [ ] Dashboard loads after login
- [ ] Map displays correctly
- [ ] Connection status shows "Connected"
- [ ] Sidebar shows "0 total carts" initially

### Functionality Testing

- [ ] Click "Create New Cart"
- [ ] Modal opens correctly
- [ ] Fill in cart details (e.g., cart001, test123)
- [ ] Cart created successfully
- [ ] Toast notification appears
- [ ] Cart appears in sidebar
- [ ] Can click on cart
- [ ] Can edit cart
- [ ] Can delete cart (with confirmation)

---

## 📱 Mobile App Setup

### Installation

- [ ] Navigate to `mobile/cartsync/` directory
- [ ] Run `npm install`
- [ ] All dependencies installed without errors

### Configuration

- [ ] Edit `src/config/constants.js`
- [ ] Set `API_URL` correctly:
  - Android Emulator: `http://10.0.2.2:5000`
  - iOS Simulator: `http://localhost:5000`
  - Real Device: `http://YOUR_COMPUTER_IP:5000`
- [ ] Verify `LOCATION_UPDATE_INTERVAL` (30000 = 30 seconds)
- [ ] Verify `NOTIFICATION_REMINDER_INTERVAL` (30 minutes)

### Android Setup (if using Android)

- [ ] Android Studio is open
- [ ] Android SDK installed
- [ ] Android emulator is running OR device connected
- [ ] USB debugging enabled (for real device)
- [ ] Run `npm run android`
- [ ] App builds successfully
- [ ] App installs on device/emulator
- [ ] App opens without crashing

### iOS Setup (if using iOS)

- [ ] Navigate to `ios/` directory
- [ ] Run `pod install`
- [ ] Pods installed successfully
- [ ] Navigate back to `mobile/cartsync/`
- [ ] Run `npm run ios`
- [ ] App builds successfully
- [ ] App opens in simulator
- [ ] App opens without crashing

### Testing

- [ ] Backend and dashboard are running
- [ ] At least one cart exists in dashboard
- [ ] App shows login screen
- [ ] Can enter cart credentials
- [ ] Login button works
- [ ] After login, home screen appears
- [ ] Cart info displays correctly
- [ ] Connection status shows

### Location Testing

- [ ] Click location tracking toggle
- [ ] Permission dialog appears
- [ ] Grant "Allow all the time" / "Always"
- [ ] Tracking starts successfully
- [ ] Status changes to "Active"
- [ ] See success message
- [ ] Persistent notification appears (Android)

### Real-time Testing

- [ ] Open dashboard while mobile tracking
- [ ] Cart appears on map with green marker
- [ ] Click marker to see details
- [ ] Status shows "Online"
- [ ] Coordinates are visible
- [ ] Wait 30 seconds
- [ ] See location update in dashboard
- [ ] Last seen timestamp updates

### Background Testing

- [ ] Location tracking is active
- [ ] Press home button (minimize app)
- [ ] Notification remains visible
- [ ] Wait 30 seconds
- [ ] Check dashboard for updates
- [ ] Location continues updating
- [ ] Return to app
- [ ] App still tracking

### Notification Testing

- [ ] Tracking is active
- [ ] Wait 30 minutes (or modify interval for testing)
- [ ] Reminder notification appears
- [ ] Notification text is correct

---

## 🔄 Integration Testing

### End-to-End Flow

- [ ] Admin creates cart in dashboard
- [ ] Cart appears in sidebar
- [ ] Cart owner logs in on mobile
- [ ] Cart owner starts tracking
- [ ] Cart appears on dashboard map (green marker)
- [ ] Location updates every 30 seconds
- [ ] Dashboard shows live updates
- [ ] Can see last seen timestamp
- [ ] Can see coordinates
- [ ] Cart goes offline when tracking stops
- [ ] Marker turns grey
- [ ] Status shows "Offline"

### Multiple Carts Testing

- [ ] Create 2-3 carts in dashboard
- [ ] Install app on multiple devices/emulators
- [ ] Login each device with different cart
- [ ] Start tracking on all devices
- [ ] All carts appear on dashboard
- [ ] Each cart has unique marker
- [ ] All updating in real-time
- [ ] Can distinguish between carts

### Network Testing

- [ ] Start tracking
- [ ] Disconnect WiFi
- [ ] Connection status shows "Disconnected"
- [ ] Reconnect WiFi
- [ ] Connection status shows "Connected"
- [ ] Tracking resumes automatically

---

## 🚀 Production Readiness

### Security

- [ ] Changed default admin password
- [ ] Using strong JWT_SECRET
- [ ] Environment variables secured
- [ ] No sensitive data in code
- [ ] CORS properly configured

### Backend

- [ ] Using production MongoDB (Atlas or similar)
- [ ] Environment variables set correctly
- [ ] HTTPS enabled (in production)
- [ ] Proper error handling tested
- [ ] Logging configured

### Dashboard

- [ ] Build created (`npm run build`)
- [ ] Production API URLs configured
- [ ] Deployed to hosting service
- [ ] HTTPS enabled
- [ ] Works on mobile browsers

### Mobile App

- [ ] Production API URL configured
- [ ] App icons added
- [ ] Splash screen added
- [ ] App name correct
- [ ] Version number set
- [ ] Signed with proper certificates
- [ ] Tested on real devices
- [ ] Battery usage acceptable
- [ ] Background tracking reliable

### Performance

- [ ] Location updates timely (< 5 seconds)
- [ ] Dashboard updates smooth
- [ ] No memory leaks
- [ ] Battery usage reasonable
- [ ] Network usage acceptable

---

## 🐛 Troubleshooting Checklist

If something doesn't work, check:

### Backend Issues

- [ ] MongoDB is running (`mongosh` connects)
- [ ] Port 5000 is available
- [ ] `.env` file exists and configured
- [ ] No errors in terminal
- [ ] Can access `http://localhost:5000`

### Dashboard Issues

- [ ] Backend is running
- [ ] Port 3000 is available
- [ ] `.env` file exists
- [ ] Browser console has no errors
- [ ] Socket.IO connection established

### Mobile Issues

- [ ] Backend is running
- [ ] API_URL is correct for your setup
- [ ] Location permissions granted (Always)
- [ ] GPS is enabled on device
- [ ] Network connection available
- [ ] No errors in Metro bundler

### Common Fixes

- [ ] Clear browser cache
- [ ] Restart backend server
- [ ] Restart dashboard
- [ ] Rebuild mobile app
- [ ] Clear Metro cache: `npm start -- --reset-cache`
- [ ] Clean Android build: `cd android && ./gradlew clean`

---

## ✅ Success Criteria

Your CartSync setup is complete when:

1. ✅ Backend runs without errors
2. ✅ Dashboard loads and shows map
3. ✅ Can login as admin
4. ✅ Can create carts
5. ✅ Mobile app installs and runs
6. ✅ Can login as cart owner
7. ✅ Location tracking starts
8. ✅ Cart appears on dashboard map
9. ✅ Real-time updates work
10. ✅ Background tracking works
11. ✅ Notifications appear
12. ✅ System stable for 30+ minutes

---

## 📊 Testing Matrix

Use this to track testing across different scenarios:

| Test               | Android Emulator | Android Device | iOS Simulator | iOS Device |
| ------------------ | ---------------- | -------------- | ------------- | ---------- |
| App installs       | [ ]              | [ ]            | [ ]           | [ ]        |
| Login works        | [ ]              | [ ]            | [ ]           | [ ]        |
| Tracking starts    | [ ]              | [ ]            | [ ]           | [ ]        |
| Foreground updates | [ ]              | [ ]            | [ ]           | [ ]        |
| Background updates | [ ]              | [ ]            | [ ]           | [ ]        |
| Notifications      | [ ]              | [ ]            | [ ]           | [ ]        |
| Network reconnect  | [ ]              | [ ]            | [ ]           | [ ]        |
| Battery efficiency | N/A              | [ ]            | N/A           | [ ]        |

---

## 🎉 Completion

- [ ] All checkboxes completed
- [ ] System running smoothly
- [ ] Documentation reviewed
- [ ] Ready for production/use

**Congratulations! CartSync is fully set up and operational!** 🚀

---

## 📝 Notes

Use this space to note any custom configurations or issues encountered:

```
Your notes here...
```

---

## 🔗 Quick Reference

- **Backend URL**: http://localhost:5000
- **Dashboard URL**: http://localhost:3000
- **Admin Login**: admin / admin123 (change this!)
- **Update Interval**: 30 seconds
- **Notification Interval**: 30 minutes

For detailed troubleshooting, see `TROUBLESHOOTING.md`  
For quick start, see `QUICKSTART.md`  
For full documentation, see `README.md`
