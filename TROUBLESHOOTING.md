# CartSync Troubleshooting Guide

Quick solutions to common issues when setting up and running CartSync.

## 🔴 Backend Issues

### MongoDB Connection Failed

**Error:**

```
MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**

1. **Check if MongoDB is running:**

   ```bash
   # Try to connect with mongosh
   mongosh

   # If it fails, start MongoDB
   # macOS with Homebrew:
   brew services start mongodb-community

   # Or manually:
   mongod --dbpath /path/to/data/directory
   ```

2. **Check MongoDB URI in `.env`:**

   ```
   MONGODB_URI=mongodb://localhost:27017/cartsync
   ```

3. **For MongoDB Atlas (cloud):**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cartsync
   ```

---

### Port Already in Use

**Error:**

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**

1. **Find and kill the process:**

   ```bash
   # macOS/Linux:
   lsof -i :5000
   kill -9 <PID>

   # Windows:
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   ```

2. **Or change the port:**
   Edit `backend/.env`:
   ```
   PORT=5001
   ```

---

### JWT Token Errors

**Error:**

```
JsonWebTokenError: invalid token
```

**Solutions:**

1. **Clear stored tokens:**

   - Dashboard: Clear browser localStorage (F12 > Application > Local Storage)
   - Mobile: Uninstall and reinstall app

2. **Check JWT_SECRET in `.env`:**

   ```
   JWT_SECRET=your-secret-key-here
   ```

3. **Re-login** after clearing tokens

---

### CORS Errors

**Error in Dashboard:**

```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solutions:**

1. **Update backend `.env`:**

   ```
   CORS_ORIGIN=http://localhost:3000
   ```

2. **For multiple origins:**
   Edit `backend/src/server.js`:
   ```javascript
   app.use(
     cors({
       origin: ["http://localhost:3000", "http://192.168.1.5:3000"],
     })
   );
   ```

---

## 🟡 Dashboard Issues

### Dashboard Won't Start

**Error:**

```
Port 3000 is already in use
```

**Solutions:**

1. **Kill process on port 3000:**

   ```bash
   # macOS/Linux:
   lsof -i :3000
   kill -9 <PID>

   # Windows:
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

2. **Or use different port:**
   Edit `dashboard/vite.config.js`:
   ```javascript
   server: {
     port: 3001,
   }
   ```

---

### Can't Connect to Backend

**Error:**

```
Network Error
```

**Solutions:**

1. **Verify backend is running:**
   Open http://localhost:5000 in browser
   Should see: `{"message":"CartSync Backend API"}`

2. **Check `.env` file:**

   ```
   VITE_API_URL=http://localhost:5000
   VITE_SOCKET_URL=http://localhost:5000
   ```

3. **Restart both servers**

---

### Map Not Showing

**Symptoms:**

- Blank map area
- Console error: "Leaflet CSS not loaded"

**Solutions:**

1. **Check Leaflet CSS is loaded in `index.html`:**

   ```html
   <link
     rel="stylesheet"
     href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
   />
   ```

2. **Clear browser cache** (Ctrl+Shift+R or Cmd+Shift+R)

3. **Check browser console** for other errors

---

### Not Receiving Real-time Updates

**Symptoms:**

- Location updates don't appear
- Cart status doesn't change

**Solutions:**

1. **Check Socket.IO connection status:**

   - Look for green "Connected" indicator in dashboard
   - Check browser console for Socket.IO logs

2. **Enable Socket.IO debug mode:**
   In browser console:

   ```javascript
   localStorage.debug = "socket.io-client:socket";
   ```

   Refresh page and check console

3. **Verify backend Socket.IO is running:**
   Check backend terminal for: "Socket.IO ready"

---

## 🟢 Mobile App Issues

### Can't Build Android App

**Error:**

```
Could not find or load main class org.gradle.wrapper.GradleWrapperMain
```

**Solutions:**

1. **Clean and rebuild:**

   ```bash
   cd android
   ./gradlew clean
   cd ..
   npm run android
   ```

2. **Delete build folders:**

   ```bash
   cd android
   rm -rf .gradle build app/build
   cd ..
   npm run android
   ```

3. **Check Android SDK is installed:**
   - Open Android Studio
   - Tools > SDK Manager
   - Install Android SDK Platform 33 (or target version)

---

### Can't Connect to Backend

**Error:**

```
Network request failed
```

**Solutions:**

1. **For Android Emulator:**
   Use `http://10.0.2.2:5000` (not localhost)

   Edit `src/config/constants.js`:

   ```javascript
   export const API_URL = "http://10.0.2.2:5000";
   ```

2. **For iOS Simulator:**
   Use `http://localhost:5000`

   ```javascript
   export const API_URL = "http://localhost:5000";
   ```

3. **For Real Device:**

   - Find your computer's IP:

     ```bash
     # macOS/Linux:
     ifconfig | grep "inet "

     # Windows:
     ipconfig
     ```

   - Use that IP:
     ```javascript
     export const API_URL = "http://192.168.1.5:5000";
     ```
   - Ensure phone is on same WiFi network
   - Check firewall allows connections

4. **Test backend is accessible:**
   Open `http://YOUR_IP:5000` in phone's browser

---

### Location Not Updating

**Symptoms:**

- Location tracking enabled but not sending updates
- Dashboard doesn't show cart

**Solutions:**

1. **Check location permissions:**

   - Android: Settings > Apps > CartSync > Permissions > Location > Allow all the time
   - iOS: Settings > CartSync > Location > Always

2. **Enable GPS:**

   - Check location services are enabled on device

3. **Check backend logs:**

   - Look for location update requests in backend terminal
   - If no requests, the mobile app isn't sending

4. **Verify JWT token:**
   - Logout and login again
   - Check AsyncStorage has token

---

### Background Tracking Stops

**Symptoms:**

- Tracking stops when app is minimized
- No updates after a few minutes

**Solutions:**

1. **Disable battery optimization (Android):**

   - Settings > Apps > CartSync > Battery > Unrestricted

2. **Keep notification visible:**

   - Don't swipe away the persistent notification

3. **Add to autostart (Xiaomi, Huawei, Oppo):**

   - Settings > Apps > Autostart > Enable for CartSync

4. **Check background restrictions:**

   - Settings > Apps > CartSync > Background activity > Allow

5. **iOS Background Location:**
   - iOS is more restrictive
   - Test thoroughly on real device
   - May need to keep app in foreground

---

### Notifications Not Showing

**Symptoms:**

- No reminder notifications
- No error notifications

**Solutions:**

1. **Check notification permissions:**

   - Android: Settings > Apps > CartSync > Notifications > Allow
   - iOS: Settings > CartSync > Notifications > Allow

2. **Check notification code initialization:**
   Look for errors in Metro bundler logs

3. **Test manually:**
   Add to `HomeScreen.js`:
   ```javascript
   notificationService.showReminderNotification();
   ```

---

### Build Errors (Android)

**Error:**

```
Could not resolve all dependencies for configuration ':app:debugRuntimeClasspath'
```

**Solutions:**

1. **Update Gradle:**
   Edit `android/build.gradle`:

   ```gradle
   classpath("com.android.tools.build:gradle:8.0.0")
   ```

2. **Clean and rebuild:**

   ```bash
   cd android
   ./gradlew clean
   cd ..
   npx react-native run-android
   ```

3. **Check Java version:**
   ```bash
   java -version
   # Should be Java 11 or higher
   ```

---

### Build Errors (iOS)

**Error:**

```
pod install failed
```

**Solutions:**

1. **Update CocoaPods:**

   ```bash
   sudo gem install cocoapods
   ```

2. **Clean and reinstall:**

   ```bash
   cd ios
   rm -rf Pods Podfile.lock
   pod install
   cd ..
   npm run ios
   ```

3. **Check Xcode is installed and up to date**

---

## 🔵 General Issues

### Can't Login (Mobile or Dashboard)

**Error:**

```
Invalid credentials
```

**Solutions:**

1. **Verify credentials:**

   - Admin: Check `backend/.env` for ADMIN_USERNAME/PASSWORD
   - Cart: Check cart was created in dashboard with correct credentials

2. **Reset admin password:**

   - Stop backend
   - Delete MongoDB cartsync database:
     ```bash
     mongosh
     use cartsync
     db.dropDatabase()
     ```
   - Restart backend (creates default admin)

3. **Create new cart:**
   - Login to dashboard as admin
   - Create cart with known credentials
   - Try logging in mobile app

---

### Everything is Slow

**Symptoms:**

- Slow location updates
- Delayed map updates

**Solutions:**

1. **Check network connection:**

   - Slow WiFi/mobile data
   - High latency

2. **Check backend performance:**

   - Look for errors in backend logs
   - Check MongoDB is responding quickly

3. **Reduce update frequency:**
   Edit `mobile/cartsync/src/config/constants.js`:
   ```javascript
   export const LOCATION_UPDATE_INTERVAL = 60000; // 60 seconds instead of 30
   ```

---

### Socket.IO Disconnecting Frequently

**Symptoms:**

- Connection status flashing online/offline
- Missing location updates

**Solutions:**

1. **Check network stability:**

   - WiFi signal strength
   - Mobile data coverage

2. **Increase reconnection attempts:**
   Edit Socket.IO configuration to allow more retries

3. **Check backend logs:**
   - Look for disconnect reasons
   - Check for server errors

---

## 🛠️ Debug Tools

### Backend Debugging

**Enable detailed logging:**
Edit `backend/src/server.js`:

```javascript
app.use(morgan("combined")); // Instead of 'dev'
```

**Check Socket.IO connections:**
Look for these logs:

```
New client connected: <socket-id>
Cart <cartId> connected
```

---

### Dashboard Debugging

**Open browser console (F12):**

- Check for JavaScript errors
- Monitor network requests (Network tab)
- Check Socket.IO events

**Enable Socket.IO debug:**

```javascript
localStorage.debug = "socket.io-client:socket";
```

---

### Mobile App Debugging

**View Metro bundler logs:**
The terminal running `npm run android` or `npm run ios`

**View device logs:**

```bash
# Android:
adb logcat | grep ReactNative

# iOS:
Use Xcode: Window > Devices and Simulators > View Device Logs
```

**Chrome DevTools (for debugging JS):**

1. Shake device or Cmd+D (iOS) / Cmd+M (Android)
2. Select "Debug"
3. Open Chrome: chrome://inspect

---

## 📞 Getting More Help

### Collect Information

When asking for help, provide:

1. **Error message** (exact text)
2. **What you were doing** when error occurred
3. **Environment:**
   - OS (macOS, Windows, Linux)
   - Node.js version: `node -v`
   - MongoDB version: `mongod --version`
   - React Native version: check `package.json`
4. **Logs:**
   - Backend terminal output
   - Dashboard browser console
   - Mobile Metro bundler logs

### Check Common Locations

1. **Backend logs:** Terminal running `npm run dev`
2. **Dashboard logs:** Browser console (F12)
3. **Mobile logs:** Metro bundler terminal
4. **MongoDB logs:** Depends on installation

### Useful Commands

```bash
# Check if ports are in use
lsof -i :5000  # Backend
lsof -i :3000  # Dashboard

# Check Node.js version
node -v

# Check MongoDB status
brew services list  # macOS
mongosh  # Try to connect

# React Native info
npx react-native info

# Clean React Native cache
cd mobile/cartsync
npm start -- --reset-cache
```

---

## ✅ Verification Checklist

Use this to verify everything is working:

- [ ] MongoDB is running and accessible
- [ ] Backend starts without errors
- [ ] Can open http://localhost:5000 in browser
- [ ] Dashboard starts without errors
- [ ] Can login to dashboard (admin/admin123)
- [ ] Can create a cart in dashboard
- [ ] Mobile app builds and installs
- [ ] Can login to mobile app with cart credentials
- [ ] Location permissions granted (Always)
- [ ] Location tracking toggles on
- [ ] Cart appears on dashboard map
- [ ] Location updates every 30 seconds
- [ ] Notifications appear
- [ ] Background tracking works (minimize app)
- [ ] Socket.IO shows connected status

If all checked, CartSync is working perfectly! 🎉

---

**Still having issues?** Check the README files in each component folder for more detailed troubleshooting.
