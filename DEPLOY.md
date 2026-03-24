Deployment notes
----------------

Frontend (Vite):
- Build: `npm run build` (produces `dist`)
- Deploy to Vercel: connect repo and Vercel will run `npm run build` and publish `dist`.
- Deploy to Netlify: connect repo and Netlify will run `npm run build` and publish `dist` (see `netlify.toml`).

Backend (Express + SQLite):
- This is a simple Express server in `server/index.js` and uses a local SQLite file `server/database.sqlite`.
- For production, use a managed database (Postgres) and set `JWT_SECRET` as an environment variable.
- You can deploy backend to Render, Railway, or Heroku. Ensure `server` script runs (currently `node server/index.js`).

General:
- Add your secrets to environment variables on the host (JWT_SECRET, DB URL, etc.).
- If you want me to create GitHub repo and deploy, I'll need access/auth tokens — or you can run the final push and authorize the deployments from your account.
