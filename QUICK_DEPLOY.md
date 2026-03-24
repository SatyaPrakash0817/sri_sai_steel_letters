# Quick Start: Deploy to Vercel in 5 Steps

## Prerequisites
- GitHub account (create at github.com if needed)
- Vercel account (sign up at vercel.com with GitHub)

## Step 1: Initialize Git and Push to GitHub

Open PowerShell in your project folder and run:

```powershell
# Initialize git if not already done
git init

# Stage all files
git add .

# Commit
git commit -m "Initial commit: Sri Sai Steel Letters"

# Add remote (replace YOUR_USERNAME and YOUR_REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Rename to main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

### To create the GitHub repository:
1. Go to https://github.com/new
2. Create repository name: `srisai-steel-letters` (or your choice)
3. Don't initialize with README (you already have code)
4. Click "Create repository"
5. Copy the repo URL and use in git remote command above

---

## Step 2: Deploy Frontend to Vercel (5 minutes)

1. Go to https://vercel.com
2. Click "New Project" (sign in with GitHub if needed)
3. Select your GitHub repository
4. Click "Import"
5. **Build Settings**:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
6. Click "Deploy"

✅ **Frontend is now live!**
- URL will be: `https://YOUR_PROJECT.vercel.app`

---

## Step 3: Deploy Backend to Railway (10 minutes)

Railway is better for Express servers than Vercel.

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Select "GitHub Repo"
5. Authorize GitHub access
6. Select your repository
7. Click "Select Service"
8. Choose "Node.js" (if prompted)
9. When dashboard opens, go to Settings → Variables
10. Add these environment variables:
    - `DB_HOST`: your-mysql-host
    - `DB_USER`: your-database-user
    - `DB_PASSWORD`: your-secure-password
    - `DB_NAME`: srisai_steel
    - `JWT_SECRET`: change-to-strong-random-value
    - `EMAIL_USER`: srisaisteelletters@gmail.com
    - `EMAIL_PASSWORD`: your-gmail-apppassword
    - `PORT`: (leave empty - Railway assigns automatically)

11. Railway will detect `server/index.js` and start deploying
12. Wait for deployment (you'll see green checkmarks)

✅ **Backend is now live!**
- Copy the public URL from Railway dashboard
- Example: `https://srisai-backend-production.up.railway.app`

---

## Step 4: Set Up MySQL Database

You need a managed MySQL database (your local MySQL won't work on the internet).

### Option A: Using Railway's MySQL (Easiest)
1. In Railway dashboard, click "+ New"
2. Select "MySQL"
3. Copy the connection details:
   - `DB_HOST`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`
4. Add to Railway environment variables (Step 3, item 10)

### Option B: Using PlanetScale (Free MySQL)
1. Go to https://planetscale.com
2. Create account
3. Create new database
4. Click "Connect"
5. Select "Node.js"
6. Copy the connection string and parse it for credentials
7. Add to Railway environment variables

### Option C: Using your existing MySQL
If you have your own MySQL server running somewhere:
1. Make sure it's accessible from internet
2. Update `DB_HOST` to your server's public IP/domain
3. Ensure firewall allows port 3306
4. Add credentials to Railway

---

## Step 5: Connect Frontend to Backend

After backend is deployed on Railway, update frontend to use the new API URL.

1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Add new variable:
   - Key: `VITE_API_BASE_URL`
   - Value: `https://your-railway-backend-url.up.railway.app` (from Step 3)
4. Click "Save"
5. Go back to "Deployments"
6. Click the latest deployment
7. Click "Redeploy" (top right menu)

Alternatively, update your API calls in code to use the env variable.

---

## Verification Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway
- [ ] MySQL database configured
- [ ] Environment variables set on Railway
- [ ] Frontend can reach backend (test with a login attempt)
- [ ] Emails are being sent (check OTP in test user registration)

---

## Production URLs

After deployment, you'll have:
- **Website**: https://YOUR_PROJECT.vercel.app
- **API**: https://YOUR_BACKEND.up.railway.app
- **Admin Login**: https://YOUR_PROJECT.vercel.app/admin/login
- **Contact Page**: https://YOUR_PROJECT.vercel.app/contact

---

## Troubleshooting

### "CORS Error" in frontend
- Add `FRONTEND_URL` to backend environment variables
- Or update CORS settings in server/index.js

### "Cannot reach backend"
- Check Railway deployment status (green ✓)
- Verify environment variables are set
- Check API URL is correct in Vercel settings

### "Database connection failed"
- Verify DB credentials are correct
- Check if MySQL database is running
- Try using Railway's managed MySQL

### "500 error from backend"
- Check Railway logs (click on your service)
- Verify all env variables are set
- Check database tables exist

---

## Need Help?

Check these files for more details:
- `VERCEL_DEPLOYMENT.md` - Detailed deployment guide
- `.env.production.example` - Environment variable template
- See Deployment section in Railway/Vercel documentation
