# MySQL Setup Guide for Sri Sai Steel Letters

## Overview
The application now uses MySQL to store user registration and login data. Follow these steps to set up MySQL and get the application running.

## Prerequisites
- MySQL Server installed on your computer
- Node.js and npm installed

## Step 1: Install MySQL Server

### Windows
1. Download MySQL Community Server from https://dev.mysql.com/downloads/mysql/
2. Run the installer and follow the setup wizard
3. During installation:
   - Choose "Config Type" - select "Server Computer"
   - Set port to `3306` (default)
   - Set MySQL Root Password (remember this!)
   - Install as Windows Service (recommended)
4. After installation, MySQL will run automatically as a service

### Mac
```bash
brew install mysql
brew services start mysql
```

### Linux (Ubuntu/Debian)
```bash
sudo apt-get install mysql-server
sudo systemctl start mysql
```

## Step 2: Create Database and User

Open MySQL Command Line Client (or use a client like MySQL Workbench):

```bash
mysql -u root -p
```

Then run these commands:

```sql
-- Create the database
CREATE DATABASE srisai_steel;

-- Create a user (or use root)
-- If using root, skip this and use DB_USER=root
CREATE USER 'srisai_user'@'localhost' IDENTIFIED BY 'your-secure-password';

-- Grant privileges
GRANT ALL PRIVILEGES ON srisai_steel.* TO 'srisai_user'@'localhost';
FLUSH PRIVILEGES;

-- Exit
EXIT;
```

## Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your MySQL credentials:
   ```env
   DB_HOST=localhost
   DB_USER=srisai_user
   DB_PASSWORD=your-secure-password
   DB_NAME=srisai_steel
   PORT=4000
   HOST=0.0.0.0
   JWT_SECRET=your-super-secret-jwt-key-change-this
   ```

   Or if using root:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=srisai_steel
   ```

## Step 4: Update Backend Code (if needed)

The backend will read environment variables on startup. If the `.env` file is not found, it will use default values:
- DB_HOST: `localhost`
- DB_USER: `root`
- DB_PASSWORD: (empty)
- DB_NAME: `srisai_steel`

## Step 5: Start the Backend Server

```bash
# From the project root directory
node server/index.js
```

The server will:
1. Connect to MySQL
2. Create the `users` table automatically (if it doesn't exist)
3. Listen on port 4000 at localhost:4000

You should see:
```
MySQL connected successfully!
Users table created/verified
Server running at http://0.0.0.0:4000
```

## Step 6: Update Backend URL (if needed for mobile)

For mobile testing on the same network:
- Update `src/pages/Login.tsx` - API endpoint
- Update `src/pages/Register.tsx` - API endpoint  
- Update `src/pages/AdminLogin.tsx` - API endpoint
- Update `src/pages/AdminDashboard.tsx` - API endpoint

Replace `http://10.24.223.155:4000` with your PC's local IP address.

## Step 7: Start Frontend Development Server

```bash
npm run dev
# or for LAN access:
npm run dev:lan
```

Access the app at:
- Local: http://localhost:5174
- LAN: http://10.24.223.155:5174 (adjust IP to your PC's IP)

## Admin Features

### Admin Login
1. Navigate to `/admin/login`
2. Sign in with an admin account (account must have `is_admin = 1` in database)

### View Admin Dashboard
After logging in as admin, access `/admin/dashboard` to see all registered users (ID, Name, Email, Registration Date).

### Make a User Admin

In MySQL:
```sql
UPDATE users SET is_admin = 1 WHERE email = 'user@example.com';
```

## Troubleshooting

### Connection Error: "ECONNREFUSED"
- Ensure MySQL service is running
- Check DB_HOST is correct (usually `localhost` or `127.0.0.1`)
- Verify port 3306 is not blocked

### Authentication Error: "Access denied for user"
- Verify DB_USER and DB_PASSWORD in `.env`
- Test connection with: `mysql -u [user] -p -h [host]`

### Users Table Not Created
- Manually create it:
  ```sql
  USE srisai_steel;
  CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```

### Mobile Login Fails
- Check that backend URL matches your PC's local IP
- Ensure phone is on same WiFi network
- Test with: `ping 10.24.223.155` from phone terminal

## Environment Variables Reference

| Variable | Default | Description |
|----------|---------|-------------|
| DB_HOST | localhost | MySQL server hostname/IP |
| DB_USER | root | MySQL username |
| DB_PASSWORD | (empty) | MySQL password |
| DB_NAME | srisai_steel | Database name |
| PORT | 4000 | Backend server port |
| HOST | 0.0.0.0 | Bind to all interfaces (LAN accessible) |
| JWT_SECRET | (generates random) | Secret key for JWT tokens |

## Production Deployment

For production, use a managed MySQL service:
- **AWS RDS**: https://aws.amazon.com/rds/mysql/
- **Google Cloud SQL**: https://cloud.google.com/sql
- **Azure MySQL**: https://azure.microsoft.com/services/mysql/
- **DigitalOcean Managed Database**: https://www.digitalocean.com/products/managed-databases

Update `.env` with your production database credentials before deploying.
