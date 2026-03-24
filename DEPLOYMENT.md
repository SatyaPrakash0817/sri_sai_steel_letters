# Sri Sai Steel Letters - Deployment Guide

## 🚀 Quick Deploy Options

Your website is now optimized for Google search and ready to deploy. You have 3 options:

---

## ✅ OPTION 1: Vercel (RECOMMENDED - Easiest & Free)

**Best for:** Quick deployment, automatic HTTPS, free hosting

### Steps:

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy Frontend:**
   ```bash
   npm run build
   vercel --prod
   ```

4. **Deploy Backend Separately:**
   - Go to [Railway.app](https://railway.app) or [Render.com](https://render.com)
   - Connect your GitHub repository
   - Deploy the backend (server/index.js)
   - Set environment variables (DB credentials, JWT secret, email config)
   - Update CORS in server/index.js to allow your Vercel domain

5. **Get Your URL:**
   - Vercel will give you a URL like: `https://srisaisteelletters.vercel.app`
   - You can add a custom domain later

---

## 🌐 OPTION 2: Google Cloud Platform (For "Google" Hosting)

**Best for:** Enterprise hosting on Google's infrastructure

### Prerequisites:
1. Google Cloud account with billing enabled
2. Install [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)

### Steps:

1. **Install Google Cloud CLI:**
   ```bash
   # Download from: https://cloud.google.com/sdk/docs/install
   gcloud init
   ```

2. **Create a new GCP project:**
   ```bash
   gcloud projects create srisaisteelletters --name="Sri Sai Steel Letters"
   gcloud config set project srisaisteelletters
   ```

3. **Enable required APIs:**
   ```bash
   gcloud services enable appengine.googleapis.com
   gcloud services enable sqladmin.googleapis.com
   ```

4. **Set up Cloud SQL (MySQL Database):**
   ```bash
   gcloud sql instances create srisai-db --tier=db-f1-micro --region=asia-south1
   gcloud sql databases create srisai_steel --instance=srisai-db
   gcloud sql users set-password root --instance=srisai-db --password=YOUR_PASSWORD
   ```

5. **Build the project:**
   ```bash
   npm run build
   ```

6. **Update server/index.js** to serve static files:
   ```javascript
   // Add this AFTER all API routes
   app.use(express.static('dist'));
   app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, '../dist/index.html'));
   });
   ```

7. **Deploy to App Engine:**
   ```bash
   gcloud app deploy app.yaml
   ```

8. **Set environment variables:**
   ```bash
   gcloud app deploy --set-env-vars="DB_HOST=YOUR_DB_HOST,DB_USER=root,DB_PASSWORD=YOUR_PASSWORD,DB_NAME=srisai_steel,JWT_SECRET=your-secret,EMAIL_USER=your-email,EMAIL_PASSWORD=your-app-password"
   ```

9. **Your site will be live at:**
   ```
   https://srisaisteelletters.appspot.com
   ```

---

## 🎯 OPTION 3: Netlify + Railway (Simple Alternative)

**Best for:** Free hosting with automatic deployments

### Frontend (Netlify):
1. Go to [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy!

### Backend (Railway):
1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Add MySQL database
4. Set environment variables
5. Deploy!

---

## 📊 After Deployment - Make Your Site Searchable on Google

### 1. Submit to Google Search Console
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your website URL
3. Verify ownership (add meta tag or DNS record)
4. Submit your sitemap: `https://yoursite.com/sitemap.xml`

### 2. Submit to Google Business Profile
1. Go to [Google Business Profile](https://business.google.com)
2. Create/claim your business listing
3. Add your website URL
4. Complete your business information

### 3. Get Listed Faster
- Share your website link on social media
- Add your website to business directories
- Create backlinks from other websites
- Google will index your site within 1-2 weeks

### 4. Track Your Rankings
- Google Search Console: See how people find you
- Google Analytics: Track website visits

---

## 🔧 Environment Variables Needed

Create a `.env.production` file with:

```env
# Database
DB_HOST=your-database-host
DB_USER=root
DB_PASSWORD=your-secure-password
DB_NAME=srisai_steel

# Server
PORT=4000
NODE_ENV=production

# Security
JWT_SECRET=your-super-secure-random-string

# Email (for OTP)
EMAIL_USER=srisaisteelletters@gmail.com
EMAIL_PASSWORD=your-gmail-app-password

# Frontend URL (for CORS)
FRONTEND_URL=https://your-deployed-site.com
```

---

## 💡 Recommended: Use Vercel (Option 1)

**Why?**
- ✅ Deploy in 2 minutes
- ✅ Free HTTPS certificate
- ✅ Automatic deployments
- ✅ Global CDN
- ✅ No server management

**Command:**
```bash
npm install -g vercel
vercel login
vercel --prod
```

That's it! Your site will be live on the internet.

---

## 📞 Need Help?

After deploying, you can:
1. Search "sri sai steel letters" on Google (within 1-2 weeks after submission)
2. Access directly via your deployment URL
3. Add a custom domain (srisaisteelletters.com)

**Current Status:**
- ✅ SEO optimized with meta tags
- ✅ robots.txt configured
- ✅ Sitemap.xml created
- ✅ Ready for deployment
