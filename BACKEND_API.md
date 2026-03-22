# Backend API Documentation

## Server Status
✅ Running on `http://localhost:5000`  
✅ MongoDB connected: `mongodb://localhost:27017/hostel-mess`  
✅ All routes configured and working

---

## API Endpoints Structure

### Authentication (`/api/auth`)
- `POST   /api/auth/register` - Register new user
- `POST   /api/auth/login` - Login user
- `GET    /api/auth/me` - Get current user (requires token)

### Mess Cuts (`/api/messcuts`)
- `POST   /api/messcuts` - Create mess cut (student)
- `GET    /api/messcuts` - Get all mess cuts
- `GET    /api/messcuts/:username` - Get student's mess cuts
- `PATCH  /api/messcuts/:id/approve` - Approve (mess_secretary)
- `PATCH  /api/messcuts/:id/reject` - Reject (mess_secretary)

### Groceries (`/api/groceries`)
- `POST   /api/groceries` - Add grocery (mess_secretary)
- `GET    /api/groceries` - Get all groceries
- `GET    /api/groceries/range?startDate=&endDate=` - Get by date range
- `DELETE /api/groceries/:id` - Delete (mess_secretary)

### Announcements (`/api/announcements`)
- `POST   /api/announcements` - Create (mess_secretary, cook, warden)
- `GET    /api/announcements` - Get all active
- `GET    /api/announcements/role/:role` - Get by role
- `DELETE /api/announcements/:id` - Delete

### Bills (`/api/bills`)
- `POST   /api/bills` - Generate bills (warden)
- `GET    /api/bills` - Get all bills (warden)
- `GET    /api/bills/:username` - Get student's bills
- `PATCH  /api/bills/:id/paid` - Mark as paid (student)

---

## Authentication Header
All protected endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Database Models Completed

✓ User (with password hashing)
✓ MessCut (with date validation)
✓ Grocery (with expense tracking)
✓ Announcement (with expiry)
✓ Bill (with payment tracking)

---

## Environment Configuration

File: `.env`
```
MONGO_URI=mongodb://localhost:27017/hostel-mess
JWT_SECRET=hostel_mess_jwt_secret_key_2026
PORT=5000
NODE_ENV=development
```

---

## Next: Frontend Setup (React + React Router)

Ready to build the React application with:
- Login/Register pages
- Role-based dashboards
- Feature components
- API integration
