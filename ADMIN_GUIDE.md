# Admin Features Guide

## Overview
The application now includes admin dashboard capabilities to manage registered users. Only admin accounts can access the admin portal.

## Admin Portal Features

### 1. Admin Login (`/admin/login`)
- Separate login page for admin users
- Requires user account with `is_admin = 1` flag in database
- Same credentials as regular user login
- Shows error if non-admin user tries to log in
- Password visibility toggle for convenience

### 2. Admin Dashboard (`/admin/dashboard`)
- **Protected Page**: Requires valid JWT admin token from admin login
- **User List**: Display all registered users with:
  - User ID
  - Full Name
  - Email Address
  - Registration Date & Time (formatted)
- **Responsive Design**: 
  - Table view on desktop
  - Card view on mobile
- **Total User Count**: Footer shows total number of registered users
- **Logout Button**: Securely logout and return to regular login

## How to Access Admin Features

### Step 1: Create an Admin User

Open MySQL and execute:
```sql
-- Set existing user as admin
UPDATE users SET is_admin = 1 WHERE email = 'user@example.com';

-- Or create new admin user directly
-- (Password must be hashed with bcrypt - easier to update existing user)
```

### Step 2: Login as Admin

1. Navigate to `/admin/login`
2. Enter admin user's email and password
3. Click "Sign In"
4. If user is admin, you'll be redirected to `/admin/dashboard`
5. If user is not admin, you'll see error: "Login failed. Please check your credentials or admin status."

### Step 3: View All Users

On the admin dashboard, you'll see:
- Complete list of all registered users
- Sortable by date (most recent first)
- Click "Logout" to exit admin panel

## API Endpoints for Admin

### Admin Login
```
POST /api/admin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Admin login successful"
}
```

### Get All Users (Admin Only)
```
GET /api/admin/users
Authorization: Bearer <admin-token>

Response:
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2024-01-15 10:30:45"
    },
    ...
  ]
}
```

## Security Notes

1. **Admin Flag**: Only users with `is_admin = 1` can access admin features
2. **JWT Protection**: Admin dashboard requires valid JWT token from admin login
3. **Server-Side Checks**: Backend validates `is_admin` flag on every admin request
4. **Password Storage**: All passwords stored as bcrypt hashes (10 salt rounds)
5. **CORS Enabled**: Cross-origin requests handled securely

## Making Users Admin (Database)

```sql
-- View all users
SELECT id, name, email, is_admin FROM users;

-- Make user admin
UPDATE users SET is_admin = 1 WHERE id = 1;

-- Verify change
SELECT id, name, email, is_admin FROM users WHERE id = 1;

-- Remove admin status
UPDATE users SET is_admin = 0 WHERE id = 1;
```

## Troubleshooting

### "Admin access required" Error
- The logged-in user doesn't have admin privileges
- Check database: `SELECT is_admin FROM users WHERE email = 'user@example.com';`
- Update with: `UPDATE users SET is_admin = 1 WHERE email = 'user@example.com';`

### "Authorization required" on Admin Dashboard
- You're not logged in or token expired
- Go to `/admin/login` and sign in again

### Can't see users on dashboard
- Check backend is running on port 4000
- Verify you accessed `/admin/login` first
- Check browser console for network errors

### API endpoint returns 401
- JWT token is invalid or expired
- Token doesn't have `is_admin: 1` flag
- Re-login at `/admin/login`

## Frontend Components

### `AdminLogin.tsx`
- Email/password form
- Show/hide password toggle
- Error handling and display
- Loading state during submission
- Link back to regular Login page

### `AdminDashboard.tsx`
- Fetches users from `/api/admin/users`
- Displays in responsive table/card format
- Loading spinner while fetching
- Error message display
- Logout functionality
- Auto-redirect to login if not authenticated

## Next Steps

1. **Setup MySQL**: Follow [MYSQL_SETUP.md](./MYSQL_SETUP.md)
2. **Create Admin User**: Update database to set `is_admin = 1`
3. **Test Admin Features**: Login and view user list
4. **Deploy**: Configure environment variables for production MySQL

## Production Considerations

- Change `JWT_SECRET` in `.env` to a strong random string
- Use managed MySQL service (AWS RDS, Google Cloud SQL, etc.)
- Keep `.env` file secure and never commit to git
- Implement additional admin features as needed (user edit, delete, permissions)
- Add audit logging for admin actions
- Consider role-based access control (RBAC) for more granular permissions
