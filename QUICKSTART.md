# CartSync - Quick Start Guide

Get CartSync up and running in 5 minutes!

## 🎯 What You're Building

A real-time cart tracking system with:

- **Backend** - Server handling location updates
- **Dashboard** - Web interface showing carts on a map
- **Mobile App** - App for cart owners to share location

## 📋 Prerequisites

Install these first:

- Node.js v18+ ([Download](https://nodejs.org/))
- MongoDB ([Download](https://www.mongodb.com/try/download/community))
- For mobile: Android Studio or Xcode

## 🚀 Step-by-Step Setup

### Step 1: Start MongoDB (5 minutes)

**macOS:**

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Windows/Linux:** Follow [MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/)

Verify MongoDB is running:

```bash
mongosh
# Should connect successfully
```

---

### Step 2: Start Backend (2 minutes)

```bash
# Navigate to backend folder
cd "khatakhat cart app/backend"

# Install dependencies
npm install

# Start server
npm run dev
```

✅ **Success**: You should see:

```
🚀 CartSync Backend Server running on port 5000
📡 Socket.IO ready for real-time connections
MongoDB Connected: localhost
```

Keep this terminal open!

---

### Step 3: Start Dashboard (2 minutes)

**Open a NEW terminal window:**

```bash
# Navigate to dashboard folder
cd "khatakhat cart app/dashboard"

# Install dependencies
npm install

# Start dashboard
npm run dev
```

✅ **Success**: Browser opens at `http://localhost:3000`

**Login with:**

- Username: `admin`
- Password: `admin123`

Keep this terminal open!

---

### Step 4: Create Your First Cart (1 minute)

In the dashboard:

1. Click **"Create New Cart"**
2. Enter:
   - Cart ID: `cart001`
   - Password: `test123`
   - Name: `Test Cart`
3. Click **"Create"**

✅ You now have a cart! Note the credentials.

---

### Step 5: Setup Mobile App (5 minutes)

**Open a NEW terminal window:**

```bash
# Navigate to mobile app folder
cd "khatakhat cart app/mobile/cartsync"

# Install dependencies
npm install
```

**Important:** Edit the API URL first!

Open `src/config/constants.js` and set:

```javascript
// For Android Emulator
export const API_URL = "http://10.0.2.2:5000";

// For iOS Simulator
// export const API_URL = 'http://localhost:5000';

// For Real Device (find your IP with: ipconfig or ifconfig)
// export const API_URL = 'http://192.168.1.XXX:5000';
```

**Run the app:**

```bash
# For Android
npm run android

# For iOS
cd ios && pod install && cd ..
npm run ios
```

---

### Step 6: Test Location Tracking (2 minutes)

1. **In Mobile App:**

   - Login with: `cart001` / `test123`
   - Toggle "Location Tracking" to **ON**
   - Grant location permissions (Always)

2. **In Dashboard:**
   - Watch the cart appear on the map!
   - See the green marker (online status)
   - Location updates every 30 seconds

🎉 **Congratulations!** CartSync is now fully operational!

---

## 🧪 Quick Test Checklist

- [ ] Backend running on port 5000
- [ ] Dashboard accessible at localhost:3000
- [ ] Can login to dashboard (admin/admin123)
- [ ] Can create a cart in dashboard
- [ ] Mobile app opens successfully
- [ ] Can login to mobile app with cart credentials
- [ ] Location tracking starts successfully
- [ ] Cart appears on dashboard map
- [ ] Real-time updates working (minimize app, wait 30s, check dashboard)

---

## 🐛 Common Issues & Fixes

### Backend won't start

```bash
# Check if MongoDB is running
mongosh

# Check if port 5000 is available
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows
```

### Dashboard can't connect to backend

- Verify backend is running
- Check `dashboard/.env` has correct API_URL
- Try opening http://localhost:5000 in browser (should show API status)

### Mobile app can't connect

- **Android Emulator:** Use `http://10.0.2.2:5000`
- **iOS Simulator:** Use `http://localhost:5000`
- **Real Device:** Use your computer's IP address (e.g., `http://192.168.1.5:5000`)
- Make sure backend is accessible from your network

### Location not updating

- Grant location permissions (Always/Allow all the time)
- Check GPS is enabled on device
- Verify backend is receiving updates (check terminal logs)

### Background tracking stops

- Disable battery optimization for the app
- Keep the app's notification visible
- On some devices (Xiaomi, Huawei), add app to autostart

---

## 📱 Using on Real Device

### Find Your Computer's IP Address

**macOS/Linux:**

```bash
ifconfig | grep "inet "
# Look for something like: 192.168.1.5
```

**Windows:**

```bash
ipconfig
# Look for IPv4 Address: 192.168.1.5
```

### Update Mobile App

Edit `mobile/cartsync/src/config/constants.js`:

```javascript
export const API_URL = "http://192.168.1.5:5000"; // Your IP here
```

### Ensure Same Network

- Connect phone to same WiFi as computer
- Firewall might block connection - allow Node.js

---

## 🎯 Next Steps

### For Development:

1. **Create more carts** in the dashboard
2. **Test multiple carts** running simultaneously
3. **Monitor real-time updates** as carts move
4. **Check location history** in the backend

### For Production:

1. Change admin password (in backend/.env)
2. Use strong JWT secret
3. Deploy backend to cloud (Heroku, AWS, Railway)
4. Use MongoDB Atlas for database
5. Deploy dashboard to Netlify/Vercel
6. Build mobile app APK/IPA

---

## 📚 Documentation

- **Backend**: `/backend/README.md`
- **Dashboard**: `/dashboard/README.md`
- **Mobile App**: `/mobile/cartsync/README.md`
- **Full Guide**: `/README.md`

---

## 🆘 Need Help?

1. **Check terminal logs** for error messages
2. **Browser console** (F12) for dashboard issues
3. **Metro bundler** logs for mobile app issues
4. **MongoDB logs** if database connection fails

---

## 🎉 You're All Set!

CartSync is now running! Here's what you have:

✅ **Backend** - Handling location updates at http://localhost:5000  
✅ **Dashboard** - Showing carts at http://localhost:3000  
✅ **Mobile App** - Tracking locations in real-time  
✅ **Real-time Updates** - Socket.IO connecting everything

**Test it out:**

- Move around with your phone
- Watch the cart move on the dashboard
- Create more carts and test multiple tracking
- Try background operation (minimize app)

Enjoy building with CartSync! 🚀
