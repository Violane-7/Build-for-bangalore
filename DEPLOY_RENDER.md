# 🚀 PranexusAI — Deployment Guide (Render + MongoDB Atlas)

This guide covers deploying your 3-service PranexusAI app to **Render** with a **MongoDB Atlas** cloud database.

---

## Architecture on Render

| Service | Type | Port | Render Type |
|---------|------|------|-------------|
| **Node/Express Backend** | API server | 5001 | Web Service |
| **Python FastAPI AI** | AI microservice | 8000 | Web Service |
| **React Client** | Frontend SPA | 3000 | Static Site |

---

## Step 1: Migrate MongoDB → Atlas (Free Tier)

Your current database is on **MongoDB Compass** (local `mongodb://localhost:27017/pranexusai`). You need a cloud database accessible by Render.

### 1.1 Create MongoDB Atlas Cluster

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign up / log in
2. Create a **Free M0 cluster** (shared)
3. Choose **AWS** → **Mumbai (ap-south-1)** (closest to you in India)
4. Cluster name: `pranexusai-cluster`

### 1.2 Set Up Database Access

1. Go to **Database Access** → **Add New Database User**
2. Choose **Password Authentication**
3. Username: `pranexusai-admin`
4. Password: **Generate a secure password** (save it!)
5. Role: **Atlas Admin** (or Read/Write to any database)

### 1.3 Set Up Network Access

1. Go to **Network Access** → **Add IP Address**
2. Click **"Allow Access from Anywhere"** (`0.0.0.0/0`)
   - Required for Render's dynamic IPs

### 1.4 Get Connection String

1. Go to **Databases** → **Connect** → **Drivers**
2. Copy the connection string:
   ```
   mongodb+srv://pranexusai-admin:<password>@pranexusai-cluster.xxxxx.mongodb.net/pranexusai?retryWrites=true&w=majority
   ```
3. Replace `<password>` with your actual password

### 1.5 Export Local Data (Optional)

If you have data in your local MongoDB you want to migrate:

```bash
# Export from local
mongodump --db pranexusai --out ./backup

# Import to Atlas
mongorestore --uri "mongodb+srv://pranexusai-admin:<password>@cluster.mongodb.net" ./backup
```

---

## Step 2: Prepare Your Code for Deployment

### 2.1 Update `server/.env` for production

> [!IMPORTANT]
> Do NOT commit `.env` files to Git. Set these as environment variables on Render.

```env
PORT=5001
MONGODB_URI=mongodb+srv://pranexusai-admin:<password>@cluster.mongodb.net/pranexusai?retryWrites=true&w=majority
JWT_SECRET=<generate-a-strong-random-secret>
AI_SERVICE_URL=https://your-ai-service-name.onrender.com
GMAIL_USER=hargunmadan9034@gmail.com
GMAIL_PASSWORD=<your-app-password>
CLIENT_URL=https://your-client-name.onrender.com
```

### 2.2 Update `ai-service/.env`

```env
OPENROUTER_API_KEY=<your-openrouter-key>
CORS_ORIGINS=https://your-client-name.onrender.com,https://your-backend-name.onrender.com
```

### 2.3 Add a `requirements.txt` check

Your `ai-service/requirements.txt` already exists. Render will auto-install from it.

### 2.4 Update Vite Client for Production

Update `client/.env` for production:

```env
VITE_API_URL=https://your-backend-name.onrender.com/api
```

### 2.5 Update CORS in `server/server.js`

Add your Render domain to CORS. Currently it uses `cors()` (allows all origins). For production, you may want to restrict:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-client-name.onrender.com'
  ]
}));
```

### 2.6 Update CORS in `ai-service/main.py`

The AI service already reads `CORS_ORIGINS` env var. Just set it on Render.

---

## Step 3: Deploy Backend (Node/Express) on Render

1. Go to [render.com](https://render.com) → **Dashboard** → **New +** → **Web Service**
2. Connect your **GitHub/GitLab repo**
3. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `pranexusai-backend` |
| **Region** | Singapore (closest to India) |
| **Root Directory** | `server` |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Plan** | Free |

4. Add **Environment Variables**:

| Key | Value |
|-----|-------|
| `PORT` | `5001` |
| `MONGODB_URI` | `mongodb+srv://...` (your Atlas string) |
| `JWT_SECRET` | `<your-strong-secret>` |
| `AI_SERVICE_URL` | `https://pranexusai-ai.onrender.com` (set after deploying AI) |
| `GMAIL_USER` | `hargunmadan9034@gmail.com` |
| `GMAIL_PASSWORD` | `<your-app-password>` |
| `CLIENT_URL` | `https://pranexusai-client.onrender.com` |
| `NODE_ENV` | `production` |

5. Click **Create Web Service**

> [!NOTE]
> On the **Free tier**, Render services spin down after 15 minutes of inactivity. The first request after sleep takes ~30-60 seconds. Upgrade to **Starter ($7/mo)** to keep the service always on.

---

## Step 4: Deploy AI Service (Python FastAPI) on Render

1. **New +** → **Web Service**
2. Connect the same repo
3. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `pranexusai-ai` |
| **Region** | Singapore |
| **Root Directory** | `ai-service` |
| **Runtime** | Python 3 |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| **Plan** | Free |

4. Add **Environment Variables**:

| Key | Value |
|-----|-------|
| `OPENROUTER_API_KEY` | `<your-key>` |
| `CORS_ORIGINS` | `https://pranexusai-backend.onrender.com,https://pranexusai-client.onrender.com` |

5. Click **Create Web Service**

> [!IMPORTANT]
> After the AI service is live, go back to the **backend service** and update `AI_SERVICE_URL` to the AI service's URL (e.g., `https://pranexusai-ai.onrender.com`).

---

## Step 5: Deploy Client (React) on Render

### Option A: Static Site (Recommended for SPA)

1. **New +** → **Static Site**
2. Connect the same repo
3. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `pranexusai-client` |
| **Root Directory** | `client` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

4. Add **Environment Variables**:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://pranexusai-backend.onrender.com/api` |

5. Add a **Rewrite Rule** for client-side routing:
   - Source: `/*`
   - Destination: `/index.html`
   - Action: Rewrite

6. Click **Create Static Site**

### Option B: If Vite Proxy is needed

If your client uses the Vite dev proxy (`/api` → backend), you need to use a real web server in production. For a Static Site, the Vite proxy doesn't run. Instead, the client should call the backend URL directly via `VITE_API_URL`. Your existing `client/src/services/` should already use `import.meta.env.VITE_API_URL`.

---

## Step 6: Post-Deployment Verification

### 6.1 Verify Backend

```bash
curl https://pranexusai-backend.onrender.com/api/ping
# Expected: {"status":"ok"}
```

### 6.2 Verify AI Service

```bash
curl https://pranexusai-ai.onrender.com/ping
# Expected: {"status":"ok","service":"PranexusAI AI Service"}
```

### 6.3 Verify Client

Open `https://pranexusai-client.onrender.com` in your browser. You should see the login page.

### 6.4 Run Smoke Tests Against Deployed Services

```bash
SERVER_URL=https://pranexusai-backend.onrender.com \
AI_URL=https://pranexusai-ai.onrender.com \
node scripts/full-test.mjs
```

---

## Step 7: Seed Doctors Data (One-Time)

After deployment, seed the doctors database:

```bash
# Set your Atlas URI and run the seed script
MONGODB_URI="mongodb+srv://..." node server/seedDoctors.js
```

---

## Common Issues

### "Application error" on Render

- Check **Logs** tab on Render dashboard
- Most common: wrong `PORT` — Render provides its own port via `$PORT` env var
- For the **backend**, Render sets `PORT` automatically. Your `server.js` already reads `process.env.PORT`, so it should work. Just make sure your env var for PORT is set correctly or let Render auto-assign.

### "MongoDB connection failed"

- Verify the Atlas connection string is correct
- Check Atlas **Network Access** allows `0.0.0.0/0`
- Check Atlas **Database Access** has the right user/password

### "CORS error from frontend"

- Ensure `CORS_ORIGINS` on the AI service includes the backend URL
- Ensure the backend `cors()` configuration includes the client URL
- The backend currently uses `cors()` with no restrictions (allows all); this works but is less secure

### Client routes return 404

- Ensure you added the **Rewrite Rule** (`/*` → `/index.html`) on the Static Site
- This is required for single-page apps with client-side routing

### Free tier cold starts

- Render free tier spins down after 15 min of inactivity
- First request takes 30-60 seconds
- Consider upgrading to Starter ($7/mo) or using a "keep-alive" ping service

---

## Environment Variables Summary

| Service | Variable | Description |
|---------|----------|-------------|
| Backend | `PORT` | Server port (Render sets this) |
| Backend | `MONGODB_URI` | MongoDB Atlas connection string |
| Backend | `JWT_SECRET` | Secret for JWT signing |
| Backend | `AI_SERVICE_URL` | URL of deployed AI service |
| Backend | `GMAIL_USER` | Email for sending verifications |
| Backend | `GMAIL_PASSWORD` | Gmail App Password |
| Backend | `CLIENT_URL` | Frontend URL (for email links) |
| AI | `OPENROUTER_API_KEY` | API key for AI models |
| AI | `CORS_ORIGINS` | Comma-separated allowed origins |
| Client | `VITE_API_URL` | Backend API base URL |
