# Sri Sai Steel Letters - Backend Deployment

## ✅ Frontend Deployed
**Live URL:** https://pixelio-reactjs-100.vercel.app

## 🔄 Backend Deployment - Manual Setup Required

Since Railway CLI had configuration issues, here's the manual web setup:

### Step 1: Go to Railway Dashboard
1. Visit: https://railway.com/project/6662c90e-5a51-4d9f-ac11-2e57588482a3
2. Look for your "sri_sai_steel_letters" project

### Step 2: Create New Backend Service
1. Click **"+ New"** button (top right)
2. Select **"Empty Service"** or **"GitHub Repo"** if you connected it
3. Name it: **"api"** or **"backend"**

### Step 3: Configure the Service
1. Go to **Settings** tab
2. Set these values:
   - **Start Command:** `node server/index.js`
   - **Build Command:** `npm install && npm run build`
   - **Port:** 4000

### Step 4: Add Environment Variables
1. Go to **Variables** tab in your new service
2. Add all these variables:
   ```
   NODE_ENV=production
   PORT=4000
   DB_HOST=mysql.railway.internal
   DB_USER=root
   DB_PASSWORD=JZbaNOdXZkhuGQeDaGIvtgyqYTLwDFWT
   DB_NAME=railway
   JWT_SECRET=sri-sai-steel-letters-production-secret-2026
   EMAIL_USER=srisaisteelletters@gmail.com
   EMAIL_PASSWORD=suxqugdohhwnsoda
   ```

### Step 5: Deploy
1. Click **Deploy** button
2. Wait for it to finish (usually 2-5 minutes)
3. Go to **Settings** → **Domain** to get your public URL

### Step 6: Update Frontend
After getting the backend URL, add it to Vercel:
1. Go to https://vercel.com/dashboard
2. Select your project
3. **Settings** → **Environment Variables**
4. Add: `VITE_API_URL=https://your-railway-backend-url.com`
5. Redeploy Vercel

---

**Need More Help?**
If the web UI is confusing, let me know and I can provide step-by-step screenshots or alternative deployment methods (Render.com, etc).
