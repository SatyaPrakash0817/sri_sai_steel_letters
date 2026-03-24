# Sri Sai Steel Letters — Website

**Professional stainless steel lettering, signage fabrication, polishing and installation.**

---

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development](#development)
- [Admin Features](#admin-features)
- [Database Setup](#database-setup)
- [Mobile Testing](#mobile-testing)
- [Project Structure](#project-structure)
- [Deployment](#deployment)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MySQL Server (for production use)

### Installation

1. **Clone and install dependencies**
```bash
npm install
```

2. **Configure environment variables**
```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your MySQL credentials
# Default: localhost, root user, empty password, srisai_steel database
```

3. **Setup MySQL Database** (See [MYSQL_SETUP.md](./MYSQL_SETUP.md) for detailed instructions)

---

## 🛠️ Development

### Start Development Server

**Frontend only:**
```bash
npm run dev
# Access at http://localhost:5174
```

**Frontend with LAN access (for mobile):**
```bash
npm run dev:lan
# Access at http://10.24.223.155:5174 (adjust IP to your machine)
```

**Backend server:**
```bash
npm run serve
# Access API at http://localhost:4000
```

**Start both frontend and backend (PowerShell):**
```bash
npm run dev:all
# Starts both servers in Windows PowerShell
```

---

## 👥 Admin Features

### Admin Login
Access the admin portal at `/admin/login` to view all registered users.

**Setup Instructions:**
1. Follow [MYSQL_SETUP.md](./MYSQL_SETUP.md) to set up MySQL
2. Register a user account via `/register`
3. Make that user admin in MySQL:
   ```sql
   UPDATE users SET is_admin = 1 WHERE email = 'your-email@example.com';
   ```
4. Login at `/admin/login` with admin credentials
5. View all users on `/admin/dashboard`

**Features:**
- View all registered users
- See user email and registration date
- Responsive table/card layout
- Secure admin authentication

See [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) for complete admin documentation.

---

## 🗄️ Database Setup

### MySQL Configuration

The application uses MySQL for storing:
- User registration data
- Login credentials (bcrypt hashed)
- Admin user flags

**Database structure:**
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Environment Variables (.env):**
```env
DB_HOST=localhost           # MySQL server hostname
DB_USER=root                # MySQL username
DB_PASSWORD=                # MySQL password (leave empty for default)
DB_NAME=srisai_steel        # Database name
PORT=4000                   # Backend server port
HOST=0.0.0.0                # Bind to all interfaces (LAN accessible)
JWT_SECRET=your-secret-key  # Change this in production!
```

See [MYSQL_SETUP.md](./MYSQL_SETUP.md) for detailed setup instructions.

---

## 📱 Mobile Testing

### LAN Access (Same Network)

1. **Find your PC's IP address:**
   - Windows: `ipconfig` → Look for "IPv4 Address"
   - Mac/Linux: `ifconfig` → Look for "inet"

2. **Update `.env` if needed** (default uses 0.0.0.0)

3. **Access from phone:**
   - Frontend: `http://[YOUR_PC_IP]:5174`
   - Backend: `http://[YOUR_PC_IP]:4000`

### Public URL (ngrok)

For sharing with others:
```bash
# Terminal 1: Start frontend
npm run dev:lan

# Terminal 2: Start backend
npm run serve

# Terminal 3: Create ngrok tunnel (frontend)
ngrok http 5174

# Terminal 4: Create ngrok tunnel (backend) - if needed
ngrok http 4000 -region in
```

---

## 📁 Project Structure

```
├── src/
│   ├── components/          # React components (Navbar, Footer, etc.)
│   ├── pages/               # Page components (Home, Login, AdminDashboard, etc.)
│   ├── context/             # React Context (AuthContext)
│   ├── assets/              # Images and static files
│   ├── App.tsx              # Main app router
│   └── main.tsx             # Entry point
├── server/
│   └── index.js             # Express backend with MySQL + JWT auth
├── public/
│   ├── logo.png             # Company logo
│   └── works/               # Gallery images
├── .env                     # Environment variables (create from .env.example)
├── .env.example             # Environment template
├── package.json             # Dependencies
└── vite.config.ts           # Vite configuration
```

### Key Pages
- `/` - Home page
- `/our-works` - Gallery of work
- `/products` - Product showcase
- `/contact` - Contact form (requires login)
- `/login` - User login
- `/register` - User registration
- `/admin/login` - Admin portal login
- `/admin/dashboard` - View all users (admin only)

---

## 🔐 Authentication

The app uses **JWT (JSON Web Tokens)** for authentication:

1. **User Registration:**
   - POST `/api/register` with name, email, password
   - Password hashed with bcrypt (10 salt rounds)
   - User created with `is_admin = false`

2. **User Login:**
   - POST `/api/login` with email, password
   - Returns JWT token
   - Token stored in browser localStorage

3. **Admin Login:**
   - POST `/api/admin/login` with email, password
   - Validates `is_admin` flag
   - Returns JWT token with admin privileges

4. **Protected Routes:**
   - `/contact` - Requires valid JWT
   - `/admin/dashboard` - Requires valid JWT with admin flag

---

## 📦 Dependencies

### Frontend
- **React** 19.2.0 - UI framework
- **Vite** 7.2.4 - Build tool
- **React Router** v6 - Client-side routing
- **TailwindCSS** 4.1.17 - Styling
- **Framer Motion** 12.23.26 - Animations
- **Lucide React** - Icons

### Backend
- **Express** 4.18.2 - Web framework
- **MySQL2** 3.18.2 - Database driver
- **bcryptjs** 2.4.3 - Password hashing
- **jsonwebtoken** 9.0.0 - JWT tokens
- **CORS** 2.8.5 - Cross-origin requests

---

## 🚢 Deployment

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend:
```bash
npm run build
```

2. Deploy the `dist/` folder to:
   - **Vercel**: https://vercel.com
   - **Netlify**: https://netlify.com

### Backend Deployment

Use a managed backend service:
- **Render**: https://render.com
- **Railway**: https://railway.app
- **Heroku**: https://heroku.com
- **Fly.io**: https://fly.io

### Database Deployment (Managed MySQL)

- **AWS RDS**: https://aws.amazon.com/rds/mysql/
- **Google Cloud SQL**: https://cloud.google.com/sql
- **Azure Database**: https://azure.microsoft.com/services/mysql/
- **DigitalOcean**: https://digitalocean.com/products/managed-databases

See [DEPLOY.md](./DEPLOY.md) for detailed deployment instructions.

---

## 📖 Documentation

- **[MYSQL_SETUP.md](./MYSQL_SETUP.md)** - Complete MySQL setup guide
- **[ADMIN_GUIDE.md](./ADMIN_GUIDE.md)** - Admin features and usage
- **[ADMIN_IMPLEMENTATION.md](./ADMIN_IMPLEMENTATION.md)** - Implementation details
- **[DEPLOY.md](./DEPLOY.md)** - Deployment instructions

---

## 🐛 Troubleshooting

### MySQL Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
- Ensure MySQL service is running
- Check database credentials in `.env`
- See [MYSQL_SETUP.md](./MYSQL_SETUP.md)

### Login/Register Not Working
- Check backend is running: `npm run serve`
- Verify MySQL is connected
- Check browser console for errors

### Admin Features Not Visible
- Ensure user has `is_admin = 1` in database
- Clear browser localStorage and login again
- Check JWT token in browser DevTools

### Mobile Access Issues
- Both devices must be on same WiFi
- Use correct PC IP address
- Update hardcoded IPs in `.env` if needed

---

## 📄 License

Licensed under MIT. See project files for details.

---

## 👨‍💻 About

Sri Sai Steel Letters website built with:
- Modern React framework
- Responsive design with TailwindCSS
- RESTful API with Express
- MySQL database
- JWT authentication
- Beautiful animations with Framer Motion

**Features:**
- ✅ Multi-page routing
- ✅ User authentication & registration
- ✅ Admin dashboard
- ✅ Responsive mobile design
- ✅ Google Maps integration
- ✅ Contact form (auth-protected)
- ✅ Gallery showcase
- ✅ Product catalog

---

**Questions?** See the documentation files or check the code comments.
