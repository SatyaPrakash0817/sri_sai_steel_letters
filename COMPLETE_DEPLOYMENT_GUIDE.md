# Complete Deployment Guide for Sri Sai Steel Letters

Your **frontend is LIVE** at: https://pixelio-reactjs-100.vercel.app

Now deploy the backend using one of these methods:

---

## 🚀 Option 1: Railway Web Dashboard (Recommended - 5 minutes)

### Step 1: Create Backend Service
1. Go to: https://railway.com/project/6662c90e-5a51-4d9f-ac11-2e57588482a3
2. Click **"+ New"** → **"Empty Service"**
3. Name it: `api`

### Step 2: Deploy Your Code
1. Click on the `api` service
2. Go to **Settings** → **GitHub**
3. Click **"Connect Repository"**
4. Select your GitHub repo (if not already connected)
5. Select branch: `main` or `master`

### Step 3: Configure Build & Start
1. Go to **Settings** → **Build & Deploy**
2. Set:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `node server/index.js`
   - **Buildpacks:** Nodejs (auto-selected)

### Step 4: Add Environment Variables
1. Go to **Variables** tab
2. Click **"Add Variable"** and add:
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

### Step 5: Deploy & Get URL
1. Click **"Deploy"** button
2. Wait 2-5 minutes for deployment
3. Go to **Settings** → **Domain** 
4. Copy your public URL (e.g., `https://api-prod.up.railway.app`)

### Step 6: Update Frontend
1. Go to https://vercel.com/dashboard
2. Select `pixelio-reactjs-100`
3. **Settings** → **Environment Variables**
4. Add: `VITE_API_URL=https://your-railway-url.com`
5. **Redeploy** (go to **Deployments** → click **Redeploy**)

✅ **Done!** Your full stack is live!

---

## 🐳 Option 2: Docker Compose (Local Testing)

```bash
# Install Docker from: https://www.docker.com/products/docker-desktop

# Run in your project directory:
docker-compose up

# Access:
# Frontend: http://localhost:3000 (needs Vite dev server)
# Backend: http://localhost:4000
# Database: localhost:3306 (MySQL)
```

---

## ☁️ Option 3: Render.com (Alternative Cloud)

### Step 1: Create New Web Service
1. Go to: https://render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo

### Step 2: Configure
- **Service Name:** `sri-sai-steel-letters`
- **Environment:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `node server/index.js`

### Step 3: Add Environment Variables
1. Go to **Environment**
2. Add the same variables as Railway (see Step 4 above)

### Step 4: Create & Deploy
- Click **"Create Web Service"**
- Wait for deployment (5-10 minutes)
- Get your public URL from the dashboard

---

## 📱 Testing Your Deployment

After backend is live, test these:

```bash
# Test API health
curl https://your-backend-url/api/health

# Test OTP sending
curl -X POST https://your-backend-url/api/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Test registration
curl -X POST https://your-backend-url/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test User",
    "email":"test@example.com",
    "phone":"9876543210",
    "password":"password123",
    "otp":"123456"
  }'
```

---

## ✅ Deployment Checklist

- [ ] Frontend deployed to Vercel
- [ ] MySQL database created on Railway
- [ ] Backend service created
- [ ] Environment variables configured
- [ ] Backend API deployed successfully
- [ ] Frontend updated with backend URL
- [ ] Frontend redeployed on Vercel
- [ ] API health check passing
- [ ] Registration/Login working
- [ ] Contact form saving to database
- [ ] OTP emails being sent
- [ ] Submitted to Google Search Console

---

## 🆘 Troubleshooting

### Backend not responding?
- Check environment variables are set correctly
- Check Railway/Render logs for errors
- Make sure database is running
- Verify MySQL password and host

### Database connection failed?
- Check `DB_HOST` is set to `mysql.railway.internal` (for Railway)
- Check database credentials match
- Verify database name is `railway` (or created)

### Frontend can't reach backend?
- Make sure backend URL in frontend matches deployed URL
- Check CORS is enabled (it is by default)
- Check Network tab in browser Dev Tools

### Still having issues?
- Check Railway build logs: https://railway.com/project/6662c90e-5a51-4d9f-ac11-2e57588482a3
- Check Vercel deployment logs: https://vercel.com/dashboard
- Review API error responses in browser console

---

## 🎯 Final Steps

Once everything is deployed:

1. **Submit to Google Search Console**
   - Go to: https://search.google.com/search-console
   - Add property: `https://pixelio-reactjs-100.vercel.app`
   - Submit sitemap: `/sitemap.xml`

2. **Google Business Profile**
   - Go to: https://business.google.com
   - Add "Sri Sai Steel Letters"
   - Add your website URL

3. **Search for yourself**
   - After 1-2 weeks, search "sri sai steel letters" on Google
   - Your site should appear!

---

**Questions?** Let me know which option you choose and I'll help get it running!
