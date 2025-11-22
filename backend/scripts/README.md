# CartSync Location Simulators

Scripts to simulate cart movement in Manipur, India for testing CartSync system.

## Overview

These scripts simulate two carts moving around Imphal, Manipur:

- **Cart 001 (Veggies)**: Moves around Ima Keithel Market area
- **Cart 002 (Cloths)**: Moves around Paona Bazaar area

The carts follow predefined routes through real locations in Imphal with slight random variations to simulate realistic GPS movement.

## Prerequisites

1. Backend server running on `http://localhost:5001`
2. PostgreSQL database running
3. Carts created with credentials:
   - Cart ID: `cart001`, Password: `cart001`
   - Cart ID: `cart002`, Password: `cart002`

## Available Scripts

### 1. Node.js Version

**File**: `simulate-manipur-movement.js`

#### Requirements

```bash
# axios is already installed in backend
cd backend
npm install
```

#### Run

```bash
cd backend
node scripts/simulate-manipur-movement.js
```

### 2. Python Version

**File**: `simulate-manipur-movement.py`

#### Requirements

```bash
pip3 install requests
```

#### Run

```bash
cd backend
python3 scripts/simulate-manipur-movement.py
```

Or make it executable:

```bash
chmod +x scripts/simulate-manipur-movement.py
./scripts/simulate-manipur-movement.py
```

## How It Works

1. **Authentication**: Logs in both carts to get JWT tokens
2. **Initial Position**: Sets starting location for each cart
3. **Movement Loop**: Every 5 seconds, moves each cart to the next point in their route
4. **Random Variation**: Adds slight GPS drift (±30m) for realism
5. **GPS Accuracy**: Simulates accuracy between 5-25 meters

## Routes

### Cart 001 (Veggies) - Ima Keithel Market Circuit

```
Ima Keithel Market (24.8120, 93.9360)
↓
Near Kangla Fort (24.8130, 93.9370)
↓
MG Avenue (24.8140, 93.9365)
↓
Khwairamband Bazaar (24.8150, 93.9375)
↓
Bir Tikendrajit Park (24.8160, 93.9380)
↓
North AOC (24.8155, 93.9390)
↓
Thangal Bazaar (24.8145, 93.9385)
↓
Paona Bazaar (24.8135, 93.9375)
↓
Back to Ima Keithel (24.8125, 93.9365)
```

### Cart 002 (Cloths) - Paona Bazaar Circuit

```
Paona Bazaar (24.8200, 93.9400)
↓
Keishampat (24.8210, 93.9410)
↓
Singjamei (24.8220, 93.9420)
↓
Lamphelpat (24.8230, 93.9430)
↓
Uripok (24.8240, 93.9440)
↓
Sagolband (24.8235, 93.9450)
↓
Thangmeiband (24.8225, 93.9445)
↓
Kwakeithel (24.8215, 93.9435)
↓
Back to Paona (24.8205, 93.9425)
```

## Sample Output

```
🚀 CartSync Manipur Location Simulator
📍 Simulating cart movement in Imphal, Manipur, India

🔐 Logging in carts...

✅ cart001 logged in successfully
📍 [15:30:45] cart001: (24.812034, 93.935987) ±12m
✅ cart002 logged in successfully
📍 [15:30:46] cart002: (24.820012, 93.940023) ±18m

🎯 Starting movement simulation...
📡 Sending updates every 5 seconds
Press Ctrl+C to stop

📍 [15:30:51] cart001: (24.813045, 93.937034) ±8m
📍 [15:30:51] cart002: (24.821023, 93.941012) ±15m
📍 [15:30:56] cart001: (24.814012, 93.936534) ±22m
📍 [15:30:56] cart002: (24.822034, 93.942001) ±11m
...
```

## Configuration

Edit the scripts to customize:

- **API_URL**: Backend server URL (default: `http://localhost:5001`)
- **UPDATE_INTERVAL**: Time between updates in seconds (default: 5)
- **Routes**: Modify the `route` arrays to change cart paths
- **Variation**: Change `variation` parameter in `addRandomVariation()` to adjust GPS drift

## Testing on Dashboard

1. Start the simulator script
2. Open dashboard at `http://localhost:3000`
3. Login with admin credentials
4. Watch carts move on the map in real-time

## Stopping the Simulation

Press `Ctrl+C` to stop. The script will display final positions before exiting.

## Troubleshooting

### "Failed to login cart001"

- Ensure carts are created with correct IDs and passwords
- Check backend is running on port 5001

### "Connection refused"

- Verify backend server is running: `curl http://localhost:5001/api/carts`
- Check PostgreSQL container is running: `docker ps | grep cartsync`

### "Unauthorized" errors

- Carts might be inactive - check `isActive` field
- JWT tokens might have expired - restart simulation

## Creating Test Carts

If carts don't exist, create them via API:

```bash
# Get admin token
TOKEN=$(curl -s -X POST http://localhost:5001/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}' | \
  grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# Create cart001
curl -X POST http://localhost:5001/api/carts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "cartId": "cart001",
    "name": "Veggies Cart",
    "password": "cart001",
    "description": "Sells fresh vegetables"
  }'

# Create cart002
curl -X POST http://localhost:5001/api/carts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "cartId": "cart002",
    "name": "Cloths Cart",
    "password": "cart002",
    "description": "Sells clothing and textiles"
  }'
```

## Notes

- Coordinates are for Imphal, Manipur, India (24.8170°N, 93.9368°E)
- Routes cover major commercial areas and landmarks
- GPS accuracy simulation mimics real mobile device behavior
- Movement speed represents walking pace (~5 seconds per point)
