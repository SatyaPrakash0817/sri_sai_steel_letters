# Vercel Deployment Guide - Sri Sai Steel Letters

## Architecture
- **Frontend**: React + Vite → Deploy to Vercel
- **Backend**: Express + MySQL → Deploy to Railway or Render
- **Database**: MySQL → Use managed service (Render, PlanetScale, or DigitalOcean)

## Step 1: Prepare Code for Deployment

### 1.1 Update environment variables
Update your `.env.production` or set in hosting platforms:
```
DB_HOST=your-mysql-host
DB_USER=your-mysql-user
DB_PASSWORD=your-secure-password
DB_NAME=srisai_steel
JWT_SECRET=your-very-secure-jwt-secret-key
EMAIL_USER=srisaisteelletters@gmail.com
EMAIL_PASSWORD=your-app-password
```

### 1.2 Update API endpoints
In your frontend code, update the API base URL:
- Development: `http://localhost:4000`
- Production: `https://your-backend-api.onrender.com` (or your backend URL)

## Step 2: Deploy Frontend to Vercel

### 2.1 Create GitHub Repository
```bash
# Initialize git
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Sri Sai Steel Letters website"

# Create a new repository on GitHub (github.com/new)
# Then:
git remote add origin https://github.com/your-username/srisai-steel-letters.git
git branch -M main
git push -u origin main
```

### 2.2 Deploy to Vercel
1. Go to https://vercel.com
2. Sign up with GitHub account
3. Click "New Project"
4. Select your GitHub repository
5. Configure:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**: None needed for frontend (API calls to backend)
6. Click "Deploy"

**Frontend will be live at**: https://your-project-name.vercel.app

## Step 3: Deploy Backend to Railway

Railway is ideal for Node.js Express servers.

### 3.1 Prepare Backend for Railway
1. Go to https://railway.app
2. Sign up with GitHub
3. Create new project
4. Select "Deploy from GitHub repo"
5. Connect your repository
6. Select root directory (where server/package.json is)
7. Set environment variables:
   - DB_HOST
   - DB_USER
   - DB_PASSWORD
   - DB_NAME
   - JWT_SECRET
   - EMAIL_USER
   - EMAIL_PASSWORD
   - PORT (leave blank - Railway assigns automatically)
   - HOST=0.0.0.0

### 3.2 Configure Railway
In package.json, ensure start script:
```json
"scripts": {
  "serve": "node server/index.js",
  "start": "node server/index.js",
  "dev": "nodemon server/index.js"
}
```

Railway will auto-detect and run `npm start`

**Backend will be live at**: https://your-railway-project.up.railway.app

## Step 4: Update Frontend API Base URL

After backend is deployed, update your API calls:

### Option 1: Environment-based (Recommended)
Create `.env.production`:
```
VITE_API_BASE_URL=https://your-railway-project.up.railway.app
```

In your API calls:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
```

### Option 2: Vercel Environment Variable
1. Go to Vercel Project Settings
2. Go to "Environment Variables"
3. Add: `VITE_API_BASE_URL=https://your-railway-project.up.railway.app`
4. Redeploy

## Step 5: Set Up MySQL Database

You need a managed MySQL service since local SQLite won't work:

### Option A: PlanetScale (MySQL-compatible)
1. Go to https://planetscale.com
2. Create account
3. Create new database
4. Get connection credentials
5. Use those as DB_HOST, DB_USER, DB_PASSWORD

### Option B: Render MySQL
1. Go to https://render.com
2. Create new MySQL database
3. Note the connection details
4. Use those in Railway environment variables

### Option C: Keep existing MySQL
If you have your own MySQL server:
1. Make sure it's accessible from internet
2. Update DB_HOST to your server's IP/domain
3. Add credentials to Railway environment variables

## Step 6: Troubleshooting

### Frontend shows 404 on production
Ensure `vercel.json` routes all requests to index.html:
```json
{
  "routes": [
    { "src": "/(.*)", "dest": "/index.html" }
  ],
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

### Backend API not connecting
1. Check CORS settings in backend
2. Update frontend API base URL
3. Verify environment variables in Railway

### Database connection error
1. Verify DB credentials
2. Check if database is accessible (check firewall/security groups)
3. Run migrations/setup on managed database

## URLs After Deployment

- **Website**: https://your-project.vercel.app
- **Backend API**: https://your-backend.up.railway.app
- **Admin Dashboard**: https://your-project.vercel.app/admin/login
- **Contact**: https://your-project.vercel.app/contact
- **User Profile**: https://your-project.vercel.app/profile

## Production Checklist

- [ ] GitHub repository created and pushed
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway
- [ ] MySQL database set up
- [ ] Environment variables configured
- [ ] API endpoints updated in frontend
- [ ] HTTPS working (automatic on both platforms)
- [ ] Custom domain configured (optional)
- [ ] Email service verified
- [ ] JWT_SECRET changed to strong value
- [ ] Tested full registration/login flow
- [ ] Tested contact form
- [ ] Tested admin dashboard
