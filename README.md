# Hostel Mess Management System - Complete Setup Guide

Both Backend and Frontend are running and ready for feature development.

---

## HOW TO START THE SYSTEM

### Backend (Node.js + MongoDB)
```bash
cd backend
npm start
# Server will run on: http://localhost:5000
```

### Frontend (React)
```bash
cd frontend
npm start
# App will open on: http://localhost:3000
```

### MongoDB (if not auto-starting)
```bash
"C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe"
```

---

## PROJECT STRUCTURE

```
hostel-mess-management/
├── backend/                    # Node.js/Express API
│   ├── config/                # Configuration (db, jwt, env)
│   ├── middleware/            # Auth, roleAuth, error handling
│   ├── models/                # MongoDB schemas (User, MessCut, etc.)
│   ├── controllers/           # Business logic
│   ├── routes/                # API endpoints
│   ├── utils/                 # Helpers (validators, bill calculator)
│   ├── server.js              # Entry point
│   ├── package.json           # Dependencies
│   ├── .env                   # Environment variables
│   └── .env.example           # Template
│
├── frontend/                  # React application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── features/          # Feature-specific logic
│   │   ├── services/          # API client & auth
│   │   ├── hooks/             # Custom React hooks
│   │   ├── styles/            # CSS files
│   │   ├── App.jsx            # Main app component
│   │   └── index.jsx          # React entry point
│   ├── public/                # Static files
│   ├── package.json           # Dependencies
│   ├── .env                   # Environment variables
│   └── .env.example           # Template
│
├── BACKEND_API.md             # API documentation
└── SETUP_STATUS.md            # Setup guide
```

---

## API ENDPOINTS (All Working)

### Authentication
```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - Login user
GET    /api/auth/me           - Get current user (protected)
```

### Mess Cuts
```
POST   /api/messcuts          - Create mess cut (student)
GET    /api/messcuts          - Get all mess cuts
GET    /api/messcuts/:username - Get student's mess cuts
PATCH  /api/messcuts/:id/approve   - Approve (mess_secretary)
PATCH  /api/messcuts/:id/reject    - Reject (mess_secretary)
```

### Groceries
```
POST   /api/groceries         - Add grocery (mess_secretary)
GET    /api/groceries         - Get all groceries
GET    /api/groceries/range   - Get by date range
DELETE /api/groceries/:id     - Delete (mess_secretary)
```

### Announcements
```
POST   /api/announcements     - Create (staff roles)
GET    /api/announcements     - Get all
GET    /api/announcements/role/:role - Get by role
DELETE /api/announcements/:id - Delete
```

### Bills
```
POST   /api/bills             - Generate bills (warden)
GET    /api/bills             - Get all bills (warden)
GET    /api/bills/:username   - Get student's bills
PATCH  /api/bills/:id/paid    - Mark as paid (student)
```

---

## USER ROLES & DASHBOARDS

### 1. Student
- Apply for mess cuts
- View cut status
- View and pay bills
- View announcements
- View expenses breakdown

### 2. Mess Secretary
- Approve/reject mess cut requests
- Add grocery purchases
- Track total expenses
- Post announcements
- Generate expense reports

### 3. Cook
- View meal count (active mess cuts)
- Access grocery inventory
- Plan meals
- View announcements

### 4. Warden
- Monitor all expenses
- Generate bills for students (auto-calculated)
- View reports
- Manage user accounts

---

## Authentication & Security

**JWT Token-Based:**
- Tokens stored in localStorage
- Auto-attach to all API requests
- Auto-logout on token expiry
- Role-based route protection

**Password Security:**
- Bcrypt hashing (10 rounds)
- Min 6 characters
- Required uppercase, lowercase, number

---

## DATABASE MODELS

### User
- name, username, password (hashed)
- role, email
- rollNumber (for students)
- timestamps

### MessCut
- username (student)
- fromDate, toDate
- status (pending/approved/rejected)
- approvedBy, approvedOn
- rejectionReason

### Grocery
- itemName, quantity, unit
- price (per unit), purchaseLocation
- date, enteredBy
- category

### Announcement
- title, message
- postedBy, role
- priority, expiryDate

### Bill
- studentUsername
- month, totalExpense, totalStudents
- amountDue (calculated)
- status (generated/pending/paid)
- paidOn, generatedBy

---

## TECHNOLOGY STACK DETAILS

**Backend:**
- Express.js 4.18.2
- MongoDB 8.2.6
- Mongoose 7.0.0
- bcryptjs 2.4.3 (password hashing)
- jsonwebtoken 9.0.0 (JWT)
- dotenv 16.0.3 (env management)
- cors 2.8.5 (cross-origin)

**Frontend:**
- React 18.2.0
- React Router DOM 6.8.0
- Axios 1.3.0 (API client)

---

## NEXT STEPS: FEATURE IMPLEMENTATION

Once all features are needed, implement in this order:

### Phase 1: Core Features (Priority)
1. ✅ Authentication (Login/Register)
2. ⏳ Mess Cut Management
3. ⏳ Grocery Management
4. ⏳ Bill Generation & Payment

### Phase 2: Secondary Features
5. Announcements System
6. Expense Reports
7. Meal Planning (Cook)

### Phase 3: Enhancements
8. Email notifications
9. SMS alerts
10. Mobile responsiveness
11. Dashboard analytics

---

## ENVIRONMENT VARIABLES

### Backend (.env)
```
MONGO_URI=mongodb://localhost:27017/hostel-mess
JWT_SECRET=hostel_mess_jwt_secret_key_2026
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## TESTING THE SYSTEM

### 1. Create Test User (via register page)
```
Name: John Student
Username: johndoe
Password: Pass123456
Role: student
```

### 2. Login
```
Username: johndoe
Password: Pass123456
```

### 3. Navigate Dashboards
- View role-specific dashboard
- All navigation working with protected routes

---

## CURRENT LIMITATIONS & NEXT

All basic CRUD operations are implemented. Features that need detailed implementation pages/forms:

- Mess Cut form + list view
- Grocery add form + inventory view
- Announcement creation & list
- Bill generation & payment interface
- Reports/Analytics views

These will have working API integration but simplified UI components for now.

---

## TROUBLESHOOTING

### Backend won't connect to MongoDB
```bash
mongod  # Start MongoDB service manually
# Or check if MongoDB service is running
```

### Frontend can't connect to backend (CORS error)
- Ensure backend is running on :5000
- Check `.env` file has correct API_URL
- Verify CORS is enabled in server.js

### EADDRINUSE error (port already in use)
```bash
# Kill process on port 5000 (backend)
taskkill /F /IM node.exe

# Or use different port - update .env
```

---

## ARCHITECTURE HIGHLIGHTS

✅ **Separation of Concerns:**
- Controllers (business logic)
- Models (data schema)
- Routes (endpoints)
- Middleware (auth, errors)

✅ **Security:**
- JWT authentication
- Role-based access control
- Password hashing
- Protected API routes

✅ **Scalability:**
- Component-based frontend
- Modular backend routes
- Database indexing ready
- Error handling throughout

✅ **Developer Experience:**
- Clear folder structure
- Reusable components & hooks
- Axios interceptors
- Environment configuration

---

##  GETTING STARTED WITH NEW FEATURES

**To add a new feature:**

1. **Backend:**
   - Create model in `models/`
   - Create controller in `controllers/`
   - Create routes in `routes/`
   - Add routes to `routes/index.js`

2. **Frontend:**
   - Create feature folder in `features/`
   - Create API file (e.g., `feature.api.js`)
   - Create components for form & list view
   - Import in relevant page component
   - Use `useFetch()` for data loading

---

## YOU'RE ALL SET!

The full-stack application is ready for feature implementation. All infrastructure, database models, and API endpoints are in place.

**Start by implementing:**
1. Mess Cut management (form + approval)
2. Grocery tracking (add + view inventory)
3. Bill generation system

Each feature will have working API integration and role-based access control.
