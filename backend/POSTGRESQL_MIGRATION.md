# PostgreSQL Migration Guide

## Overview

CartSync backend has been migrated from **MongoDB with Mongoose** to **PostgreSQL with Sequelize**. This document outlines all changes and how to use the new database setup.

---

## What Changed?

### 1. **Database Technology**

- **Before**: MongoDB 8.0.3 (local installation required)
- **After**: PostgreSQL 16 Alpine (runs in Docker container)

### 2. **ORM/ODM**

- **Before**: Mongoose 8.7.2
- **After**: Sequelize 6.35.2 with pg driver

### 3. **Data Structure**

- **Before**: Nested objects (e.g., `cart.lastLocation = {latitude, longitude, ...}`)
- **After**: Flattened columns (e.g., `cart.lastLocationLatitude`, `cart.lastLocationLongitude`)

---

## Key Benefits

✅ **Easier Setup**: Docker container starts PostgreSQL with one command  
✅ **Better Query Performance**: Indexed columns instead of nested documents  
✅ **SQL Compatibility**: Standard SQL queries and relationships  
✅ **Schema Enforcement**: Stronger data typing and constraints  
✅ **Portable**: Docker volume persists data, container is platform-independent

---

## New Dependencies

Added to `package.json`:

```json
{
  "pg": "^8.11.3",
  "pg-hstore": "^2.3.4",
  "sequelize": "^6.35.2"
}
```

Removed:

```json
{
  "mongoose": "^8.7.2"
}
```

---

## Database Setup

### Start PostgreSQL Container

```bash
# Start PostgreSQL in the background
npm run db:start

# Check if container is running
docker ps | grep cartsync-db
```

This starts:

- PostgreSQL 16 on port **5432**
- Database: `cartsync`
- Username: `cartsync`
- Password: `cartsync123`
- Volume: `cartsync_postgres_data` (persists data)

### Stop Database

```bash
npm run db:stop
```

### Reset Database (Delete All Data)

```bash
npm run db:reset
```

⚠️ **Warning**: This deletes the Docker volume and all data!

---

## Model Changes

### Cart Model (`src/models/Cart.js`)

**Before (Mongoose)**:

```javascript
{
  cartId: String,
  name: String,
  lastLocation: {
    latitude: Number,
    longitude: Number,
    accuracy: Number,
    timestamp: Date
  },
  // ...
}
```

**After (Sequelize)**:

```javascript
{
  cartId: DataTypes.STRING,
  name: DataTypes.STRING,
  lastLocationLatitude: DataTypes.DOUBLE,
  lastLocationLongitude: DataTypes.DOUBLE,
  lastLocationAccuracy: DataTypes.DOUBLE,
  lastLocationTimestamp: DataTypes.DATE,
  // ...
}
```

**API Response** (unchanged - model uses `toJSON()` to reconstruct nested object):

```json
{
  "cartId": "CART001",
  "name": "Cart 1",
  "lastLocation": {
    "latitude": 40.7128,
    "longitude": -74.006,
    "accuracy": 10,
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### LocationHistory Model (`src/models/LocationHistory.js`)

**Before**:

```javascript
{
  cartId: String,
  location: {
    latitude: Number,
    longitude: Number,
    accuracy: Number
  },
  timestamp: Date
}
```

**After**:

```javascript
{
  cartId: DataTypes.STRING,
  locationLatitude: DataTypes.DOUBLE,
  locationLongitude: DataTypes.DOUBLE,
  locationAccuracy: DataTypes.DOUBLE,
  timestamp: DataTypes.DATE
}
```

**API Response** (unchanged):

```json
{
  "cartId": "CART001",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.006,
    "accuracy": 10
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Admin Model (`src/models/Admin.js`)

**Before**:

```javascript
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

adminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
```

**After**:

```javascript
const Admin = sequelize.define("Admin", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Admin.beforeCreate(async (admin) => {
  admin.password = await bcrypt.hash(admin.password, 10);
});

Admin.beforeUpdate(async (admin) => {
  if (admin.changed("password")) {
    admin.password = await bcrypt.hash(admin.password, 10);
  }
});
```

---

## Query Syntax Changes

### Find All Records

**Before**:

```javascript
const carts = await Cart.find().select("-password");
```

**After**:

```javascript
const carts = await Cart.findAll({
  attributes: { exclude: ["password"] },
});
```

### Find One Record

**Before**:

```javascript
const cart = await Cart.findOne({ cartId: "CART001", isActive: true });
```

**After**:

```javascript
const cart = await Cart.findOne({
  where: { cartId: "CART001", isActive: true },
});
```

### Create Record

**Before**:

```javascript
const cart = new Cart({ cartId, name, password });
await cart.save();
```

**After**:

```javascript
const cart = await Cart.create({ cartId, name, password });
```

### Update Record

**Before**:

```javascript
const cart = await Cart.findOne({ cartId });
cart.status = "active";
await cart.save();
```

**After** (same!):

```javascript
const cart = await Cart.findOne({ where: { cartId } });
cart.status = "active";
await cart.save();
```

### Delete Record

**Before**:

```javascript
await Cart.findOneAndDelete({ cartId });
await LocationHistory.deleteMany({ cartId });
```

**After**:

```javascript
const cart = await Cart.findOne({ where: { cartId } });
await cart.destroy();
await LocationHistory.destroy({ where: { cartId } });
```

### Comparison Operators

**Before**:

```javascript
const staleCarts = await Cart.find({
  isOnline: true,
  lastSeen: { $lt: fiveMinutesAgo },
});
```

**After**:

```javascript
const { Op } = require("sequelize");

const staleCarts = await Cart.findAll({
  where: {
    isOnline: true,
    lastSeen: { [Op.lt]: fiveMinutesAgo },
  },
});
```

Common operators:

- `Op.eq` - Equal (=)
- `Op.ne` - Not equal (!=)
- `Op.gt` - Greater than (>)
- `Op.gte` - Greater than or equal (>=)
- `Op.lt` - Less than (<)
- `Op.lte` - Less than or equal (<=)
- `Op.like` - LIKE (pattern matching)
- `Op.in` - IN (array)

---

## Environment Configuration

### Before (`.env`)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cartsync
JWT_SECRET=your-secret-key-change-in-production
```

### After (`.env`)

```env
PORT=5000
DATABASE_URL=postgresql://cartsync:cartsync123@localhost:5432/cartsync
JWT_SECRET=your-secret-key-change-in-production
```

The `DATABASE_URL` format is:

```
postgresql://[username]:[password]@[host]:[port]/[database]
```

---

## File Changes Summary

### Modified Files

| File                            | Changes                                                |
| ------------------------------- | ------------------------------------------------------ |
| `package.json`                  | Removed mongoose, added pg/sequelize, added db scripts |
| `.env`                          | Changed MONGODB_URI → DATABASE_URL                     |
| `src/config/database.js`        | Replaced Mongoose connection with Sequelize            |
| `src/models/Cart.js`            | Mongoose schema → Sequelize model, flattened location  |
| `src/models/Admin.js`           | Mongoose schema → Sequelize model                      |
| `src/models/LocationHistory.js` | Mongoose schema → Sequelize model                      |
| `src/routes/auth.js`            | Updated query syntax (added `where` clauses)           |
| `src/routes/carts.js`           | Updated all CRUD operations to Sequelize               |
| `src/routes/location.js`        | Flattened location updates, Sequelize queries          |
| `src/middleware/auth.js`        | Updated `findOne()` to use `where` clause              |
| `src/services/socketService.js` | Updated all Cart queries to Sequelize                  |
| `src/server.js`                 | Changed import: `connectDB` → `{connectDB}`            |

### New Files

| File                      | Purpose                            |
| ------------------------- | ---------------------------------- |
| `docker-compose.yml`      | PostgreSQL container configuration |
| `POSTGRESQL_MIGRATION.md` | This guide                         |

---

## Running the Backend

### First Time Setup

```bash
# 1. Start PostgreSQL container
npm run db:start

# 2. Install new dependencies
npm install

# 3. Start backend (creates tables automatically)
npm run dev
```

On first run, Sequelize will:

1. Authenticate to PostgreSQL
2. Create tables (`Carts`, `Admins`, `LocationHistories`)
3. Create default admin user (username: `admin`, password: `admin123`)

### Daily Development

```bash
# Start database (if not running)
npm run db:start

# Start backend
npm run dev
```

### Production

```bash
# Start PostgreSQL
docker-compose up -d

# Start backend
npm start
```

---

## API Compatibility

✅ **All API endpoints remain unchanged**  
✅ **Request/response formats are identical**  
✅ **Frontend/mobile app require no changes**

The migration is **transparent to API consumers** because:

- Models use `toJSON()` methods to reconstruct nested objects
- Routes return the same JSON structure
- Authentication flow is unchanged
- Socket.IO events have the same format

---

## Verification Steps

### 1. Check PostgreSQL is Running

```bash
docker ps | grep cartsync-db
```

Expected output:

```
[container-id]  postgres:16-alpine  ... Up X minutes  5432/tcp  cartsync-db
```

### 2. Check Database Connection

```bash
npm run dev
```

Expected logs:

```
Database connection authenticated successfully
Database synchronized successfully
✓ Created default admin user
Server running on port 5000
```

### 3. Test Admin Login

```bash
curl -X POST http://localhost:5000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

Expected response:

```json
{
  "token": "eyJhbGciOiJIUzI1...",
  "admin": {
    "username": "admin"
  }
}
```

### 4. Create Test Cart

```bash
# Save the admin token from previous step
TOKEN="your-token-here"

curl -X POST http://localhost:5000/api/carts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "cartId": "TEST001",
    "name": "Test Cart",
    "password": "test123",
    "phoneNumber": "1234567890"
  }'
```

Expected response:

```json
{
  "message": "Cart created successfully",
  "cart": {
    "cartId": "TEST001",
    "name": "Test Cart",
    "phoneNumber": "1234567890",
    "isActive": true,
    "isOnline": false
  }
}
```

### 5. Check Database Contents

```bash
# Connect to PostgreSQL
docker exec -it cartsync-db psql -U cartsync -d cartsync

# List tables
\dt

# Query carts
SELECT "cartId", name, "isActive", "isOnline" FROM "Carts";

# Exit
\q
```

---

## Troubleshooting

### Issue: "Container name already in use"

```bash
# Stop and remove old container
docker stop cartsync-db
docker rm cartsync-db

# Start fresh
npm run db:start
```

### Issue: "Port 5432 already in use"

Another PostgreSQL instance is running. Find and stop it:

```bash
# macOS
lsof -i :5432
sudo pkill -9 postgres

# Linux
sudo netstat -tulpn | grep 5432
sudo systemctl stop postgresql
```

Or change the port in `docker-compose.yml`:

```yaml
ports:
  - "5433:5432" # Use 5433 on host
```

And update `.env`:

```env
DATABASE_URL=postgresql://cartsync:cartsync123@localhost:5433/cartsync
```

### Issue: "Database connection failed"

```bash
# Check container logs
docker logs cartsync-db

# Restart container
npm run db:stop
npm run db:start

# Verify health
docker exec cartsync-db pg_isready -U cartsync
```

### Issue: "Tables not created"

```bash
# Delete data and recreate
npm run db:reset
npm run db:start
npm run dev
```

### Issue: "Password authentication failed"

Check credentials match in:

1. `docker-compose.yml` (POSTGRES_USER, POSTGRES_PASSWORD)
2. `.env` (DATABASE_URL username/password)

### Issue: "Admin user not created"

```bash
# Manually create admin
docker exec -it cartsync-db psql -U cartsync -d cartsync

INSERT INTO "Admins" (username, password, "createdAt", "updatedAt")
VALUES ('admin', '$2a$10$...', NOW(), NOW());
```

Or let the app create it automatically by deleting and recreating the admin:

```sql
DELETE FROM "Admins" WHERE username = 'admin';
-- Restart backend - it will recreate the admin
```

---

## Rollback to MongoDB

If you need to revert to MongoDB:

### 1. Restore Original Files

```bash
# Assuming you have a git backup
git checkout HEAD~[number-of-commits] -- backend/
```

### 2. Reinstall Dependencies

```bash
cd backend
npm install
```

### 3. Update Environment

Change `.env` back to:

```env
MONGODB_URI=mongodb://localhost:27017/cartsync
```

### 4. Start MongoDB

```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

---

## Next Steps

1. **Update Dashboard**: No changes needed (API is compatible)
2. **Update Mobile App**: No changes needed (API is compatible)
3. **Production Deployment**:
   - Use managed PostgreSQL (AWS RDS, Heroku Postgres, etc.)
   - Update `DATABASE_URL` in production environment
   - Run migrations on production database
4. **Backup Strategy**:
   - Set up automated PostgreSQL backups
   - Use Docker volume backups or pg_dump

---

## Resources

- [Sequelize Docs](https://sequelize.org/docs/v6/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Sequelize Query Interface](https://sequelize.org/docs/v6/core-concepts/model-querying-basics/)

---

**Migration completed**: January 2024  
**Backend Version**: 1.1.0 (PostgreSQL)  
**Compatibility**: Full backwards compatibility with existing frontends
