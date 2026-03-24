# User Profile & Authentication System - Implementation Guide

## Overview
This document outlines the new user profile system with email-based OTP registration, profile viewing, and settings management.

## New Features

### 1. Email-Based OTP Registration
- **Changed from**: Phone-based OTP
- **Changed to**: Email-based OTP sent via Nodemailer
- Users now receive OTP codes in their email inbox
- OTP remains valid for 5 minutes
- Demo mode displays OTP on screen for testing

### 2. User Profile Page (`/profile`)
After logging in, users are redirected to their profile page showing:
- Full Name
- Email Address  
- Phone Number
- Member Since (account creation date)
- Settings button to update profile or change password
- Logout button

**Only authenticated users can access this page**

### 3. Settings Page (`/settings`)
Protected page with two tabs:

#### Tab 1: Edit Profile
- Update name
- Update phone number
- Email cannot be changed (read-only)
- Real-time form validation
- Success/error messages

#### Tab 2: Change Password
- Current password verification
- New password entry with show/hide toggle
- Confirm new password field
- Password strength requirement: minimum 6 characters
- Passwords must match before submission
- Success/error messages

### 4. Navbar Updates
- Shows "Profile" link and "Logout" button when user is logged in
- Shows "Sign In" button when user is not logged in
- Responsive design for mobile and desktop
- Logout clears authentication and redirects to login

## Backend API Endpoints

### User Authentication & Profile

#### 1. Send OTP (Email-based)
```
POST /api/send-otp
Body: { email: string }
Response: { message: string, demo_otp: string }
```
Sends OTP to user's email address. Demo mode returns OTP in response for testing.

#### 2. Register User
```
POST /api/register
Body: { name: string, email: string, phone: string, password: string, otp: string }
Response: { message: string }
```
Verifies OTP and creates user account.

#### 3. Login User
```
POST /api/login
Body: { email: string, password: string }
Response: { token: string }
```
Returns JWT token valid for 7 days.

#### 4. Get User Profile
```
GET /api/profile
Headers: Authorization: Bearer <token>
Response: { user: { id, name, email, phone, created_at } }
```
Requires authentication. Returns user's profile information.

#### 5. Update User Profile
```
PUT /api/profile/update
Headers: Authorization: Bearer <token>
Body: { name: string, phone: string }
Response: { message: string, user: {...} }
```
Updates user's name and phone number. Email cannot be changed.

#### 6. Change Password
```
POST /api/password/change
Headers: Authorization: Bearer <token>
Body: { currentPassword: string, newPassword: string }
Response: { message: string }
```
Verifies current password and updates to new password.

## Authentication Flow

```
1. User Opens App
   ↓
2. User Registers:
   - Enter name, email, phone, password
   - Click "Send OTP"
   - OTP sent to email (demo also shows on screen)
   - Enter 6-digit OTP
   - Click "Verify & Register"
   - Database creates user account
   ↓
3. User Logs In:
   - Enter email & password
   - Returns JWT token
   - Token stored in localStorage (key: 'authToken')
   - Redirected to /profile
   ↓
4. User Profile Page:
   - Displays name, email, phone, member since
   - Can access Settings
   - Can Logout
   ↓
5. Settings Page:
   - Edit profile (name, phone)
   - Change password
   - Back to profile
   ↓
6. Navigation:
   - Profile link visible in navbar when logged in
   - Logout button visible in navbar
```

## Technical Details

### Frontend Stack
- React 19.2.0
- React Router v6
- TailwindCSS 4.1.17
- Framer Motion (animations)
- lucide-react (icons)

### Backend Stack
- Express 4.18.2
- MySQL 2 (database)
- bcryptjs (password hashing - 10 salt rounds)
- jsonwebtoken (JWT auth - 7 day expiry)
- Nodemailer (email OTP delivery)

### Database Schema
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### Environment Variables (.env)
```
# Email Configuration
EMAIL_USER=srisaisteelletters@gmail.com
EMAIL_PASSWORD=suxq ugdo hhwn soda

# MySQL Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=1234
DB_NAME=srisai_steel

# Server Configuration
PORT=4000
HOST=0.0.0.0

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## File Structure

### New/Modified Files
```
src/
├── pages/
│   ├── UserProfile.tsx          (NEW)
│   ├── Settings.tsx              (NEW)
│   ├── Register.tsx              (UPDATED - email OTP)
│   ├── Login.tsx                 (UPDATED - redirect to /profile)
│   └── AdminDashboard.tsx        (UPDATED - use token from context)
├── components/
│   └── Navbar.tsx                (UPDATED - profile & logout links)
├── context/
│   └── AuthContext.tsx           (UPDATED - added isAuthenticated)
└── App.tsx                       (UPDATED - added routes)

server/
└── index.js                      (UPDATED - email OTP, profile endpoints)

.env                              (UPDATED - email credentials)
```

## Testing Checklist

### 1. Registration with Email OTP
- [ ] Visit `/register`
- [ ] Fill form: name, email, phone (10 digits), password (6+ chars)
- [ ] Click "Send OTP"
- [ ] OTP appears on screen (demo mode)
- [ ] Check email for OTP code
- [ ] Enter OTP and click "Verify & Register"
- [ ] Account created successfully
- [ ] Redirected to login page

### 2. Login Flow
- [ ] Visit `/login`
- [ ] Enter registered email and password
- [ ] Redirected to `/profile`
- [ ] Profile page shows correct user data

### 3. User Profile Page
- [ ] Shows name, email, phone
- [ ] Shows "Member Since" date
- [ ] Settings button navigates to `/settings`
- [ ] Logout button clears token and redirects to `/login`

### 4. Settings - Edit Profile
- [ ] Navigate to Settings from profile
- [ ] Click "Edit Profile" tab
- [ ] Can edit name
- [ ] Can edit phone (10 digits only)
- [ ] Email field is read-only
- [ ] Click "Update Profile"
- [ ] Success message appears
- [ ] Profile page reflects changes

### 5. Settings - Change Password
- [ ] Click "Change Password" tab
- [ ] Enter current password
- [ ] Enter new password (6+ chars)
- [ ] Confirm new password
- [ ] Click "Change Password"
- [ ] Success message appears
- [ ] Can logout and login with new password

### 6. Navbar Updates
- [ ] When logged out: Shows "Sign In", "Get Started", "Admin"
- [ ] When logged in: Shows "Profile", "Logout"
- [ ] Mobile view shows all options in menu
- [ ] Logout button works correctly

### 7. Admin Dashboard
- [ ] Admin login still works
- [ ] Redirects to `/admin/dashboard`
- [ ] Lists all users
- [ ] Logout works

## Production Deployment Notes

### Email Configuration
1. In production, the `demo_otp` field should be removed from API response
2. Ensure EMAIL_USER and EMAIL_PASSWORD are stored in environment variables
3. Consider using environment-specific email templates
4. Implement OTP retry limits to prevent abuse

### Security
1. Change JWT_SECRET to a secure random string
2. Implement rate limiting on `/api/send-otp` and `/api/login`
3. Consider adding email verification before account activation
4. Consider adding 2FA using TOTP or SMS

### Database
1. Enable MySQL SSL connections
2. Use connection pooling in production (already configured)
3. Regular backups of users table
4. Monitor for suspicious registration patterns

### Email Service
1. Consider Transactional Email services:
   - SendGrid
   - Mailgun
   - AWS SES
   - Twilio SendGrid
2. Current Gmail app password method has limits:
   - 500 emails/day from Gmail apps
   - Rate limited to 10 requests/second per user

## Troubleshooting

### OTP Not Received
1. Check spam/promotions folder in email
2. Verify EMAIL_USER and EMAIL_PASSWORD in .env
3. Check backend console for email errors
4. Ensure Gmail account has "Less secure app access" enabled (if using Gmail)

### Login Issues
1. Verify token is being stored in localStorage with key 'authToken'
2. Check JWT_SECRET matches frontend and backend
3. Ensure `Authorization: Bearer <token>` header is correct

### Profile Update Fails
1. Verify phone is 10 digits
2. Ensure name is not empty
3. Check token hasn't expired (7 day limit)

### Password Change Issues
1. Verify current password is correct
2. New password must be 6+ characters
3. Passwords must match exactly
4. User must be authenticated

## Next Steps

### Recommended Enhancements
1. **Email Verification**: Verify email before account activation
2. **Two-Factor Authentication**: Add TOTP or SMS-based 2FA
3. **Password Reset**: Implement forgot password via email OTP
4. **Social Login**: Add Google/Facebook OAuth
5. **User Preferences**: Save theme, language, notification settings
6. **Activity Logs**: Track login history and account changes
7. **Account Deletion**: Allow users to delete their accounts
8. **Email Change**: Add email verification for email updates

## Support
For issues or questions, refer to the backend API documentation and frontend component files above.
