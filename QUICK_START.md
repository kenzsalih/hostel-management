# 🚀 Quick Start Commands

## 1️⃣ START THE ENTIRE SYSTEM (First Time)

### Terminal 1: Backend
```bash
cd hostel-mess-management/backend
npm install
npm start
```

### Terminal 2: MongoDB
```bash
"C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe"
```

### Terminal 3: Frontend
```bash
cd hostel-mess-management/frontend
npm install
npm start
```

---

## 2️⃣ SUBSEQUENT TIMES (Just Run)

### Terminal 1: Backend
```bash
cd hostel-mess-management/backend
npm start
```

### Terminal 2: Frontend
```bash
cd hostel-mess-management/frontend
npm start
```

MongoDB runs as a service (auto-starts).

---

## 3️⃣ TESTING USER ACCOUNTS

### Test Student
```
Name: Test Student
Username: student1
Password: Pass@123
Email: student@example.com
Roll: 2024001
```

### Test Mess Secretary
```
Username: secretary1
Password: Pass@123
Email: secretary@example.com
```

### Test Warden
```
Username: warden1
Password: Pass@123
Email: warden@example.com
```

---

## 4️⃣ URLS

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/api/health

---

## 5️⃣ COMMON ISSUES & QUICK FIXES

### Port Already in Use?
```bash
# Kill Node processes
taskkill /F /IM node.exe

# Or use different port (update .env)
PORT=5001
```

### MongoDB Not Connecting?
```bash
# Check MongoDB is installed
mongosh --version

# Start it manually
"C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe"
```

### CORS Error?
- ✅ Backend running on :5000
- ✅ Frontend .env has `REACT_APP_API_URL=http://localhost:5000/api`
- ✅ Clear browser cache & reload

---

## 6️⃣ USEFUL COMMANDS

```bash
# Backend - run in dev mode with nodemon
npm run dev

# Frontend - run on different port
PORT=3001 npm start

# Check MongoDB
mongosh

# Verify all is running
curl http://localhost:5000/api/health
```

---

## 7️⃣ PROJECT FILES TO KNOW

**Backend Core Files:**
- `server.js` - Main entry point
- `config/database.js` - MongoDB connection
- `config/jwt.js` - Token management
- `models/` - Database schemas
- `controllers/` - Business logic layer
- `routes/` - API endpoints

**Frontend Core Files:**
- `src/App.jsx` - Main app with routing
- `src/services/api.js` - API client
- `src/services/auth.service.js` - Auth logic
- `src/hooks/` - Custom React hooks
- `src/pages/` - Full page components

---

## 8️⃣ NEXT FEATURE TO IMPLEMENT

### MessCut Management Page
1. Create `frontend/src/features/messcuts/MessCutForm.jsx`
2. Create `frontend/src/features/messcuts/MessCutList.jsx`
3. Create API functions in same folder
4. Add routes for `/student/messcut` and `/secretary/messcuts`
5. Test with backend API

We're ready whenever you are!
