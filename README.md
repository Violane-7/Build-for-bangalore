# PranexusAI — Full Stack MERN + Python AI Boilerplate

A production-ready health prediction and prevention platform built with React, Node/Express, MongoDB, and Python FastAPI.

**Status:** ✅ Fully scaffolded. All 3 services ready to develop.

---

## 📦 What's Included

### Frontend (React + Vite)
- ✅ Auth system (Login/Register with JWT)
- ✅ 11 pages (Landing, Dashboard, GlassBody, Exposome, Appointments, Grocery, Goals, Wearable, Emergency)
- ✅ Component folders for each feature (with TODOs for each dev)
- ✅ API service layer (`healthService.js`)
- ✅ Custom hooks (`useHealthMetrics`)
- ✅ Dark theme UI

### Backend (Node/Express)
- ✅ 7 Mongoose models (User, HealthMetrics, Prediction, Appointment, GroceryScan, ExposomeData, MedicalReport)
- ✅ 6 route files with full CRUD logic
- ✅ JWT auth middleware
- ✅ AI service caller (`aiService.js`) with all 11 endpoints

### AI Microservice (Python FastAPI)
- ✅ 11 fully functional endpoints:
  - `POST /predict/risk` — disease risk prediction
  - `POST /recommend` — personalized recommendations
  - `POST /baseline-compare` — health improvement tracking
  - `POST /glycemic-curve` — glucose response modeling
  - `POST /sleep-debt` — sleep analysis
  - `POST /dopamine-score` — screen time impact
  - `POST /age-biological` — biological age estimation
  - `POST /grocery-analyze` — nutrition analysis
  - `POST /exposome-risk` — environmental risk assessment
  - `POST /goal-plan` — milestone planning
  - `POST /emergency-detect` — emergency detection
- ✅ Rule-based ML engine (ready for real models)

### Root Config
- ✅ `docker-compose.yml` (optional Docker setup)
- ✅ `.gitignore` (node_modules, .env, models)
- ✅ `package.json` with `npm run dev` for all services
- ✅ `.env.example` with all variables documented

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ (for client & server)
- **Python** 3.9+ (for AI service)
- **MongoDB Atlas** account (free tier OK)

### Setup (Day 1)

#### 1. Clone / Setup
```bash
git clone <repo>
cd buildForBenglore
npm install
```

#### 2. Configure Environment
Copy and edit `.env` files:
```bash
# server/.env — fill in your MongoDB connection string
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/pranexusai
JWT_SECRET=your_random_secret_here

# ai-service/.env
MONGODB_URI=<same as above>
PORT=8000

# client/.env
VITE_API_URL=http://localhost:5000/api
```

#### 3. Install Dependencies
```bash
npm run install:all
```

#### 4. Start Services (choose one method)

**Option A: Locally (3 terminals)**
```bash
# Terminal 1 — Frontend
cd client && npm run dev              # http://localhost:3000

# Terminal 2 — Backend
cd server && npm run dev              # http://localhost:5000

# Terminal 3 — AI Service (requires Python)
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000  # http://localhost:8000
```

**Option B: Docker (all-in-one)**
```bash
docker-compose up
```

---

## 📋 Feature Assignment

| Dev | Component | Files |
|---|---|---|
| **Dev 1** | Glass Body, Emergency, Medical Reports | `client/src/components/GlassBody/`, `Emergency/` |
| **Dev 2** | Dashboard, Health Charts, Exposome, Wearable | `client/src/components/Dashboard/`, `Exposome/`, `Wearable/` |
| **Dev 3** | Appointments, Grocery, Goals | `client/src/components/Appointments/`, `Grocery/`, `GoalPlanner/` |
| **AI Dev** | All 11 AI endpoints | `ai-service/routers/` |

Each component file has a `// TODO` comment showing what to build.

---

## 🔗 API Contract

### Example Request

**Frontend calls Backend:**
```javascript
// client/src/services/healthService.js
import api from "./api";
const response = await api.post("/health/analyze");
```

**Backend calls AI Service:**
```javascript
// server/services/aiService.js
const aiService = require("./aiService");
const prediction = await aiService.predictRisk({ userId, metrics });
```

**AI Service returns:**
```json
{
  "userId": "12345",
  "riskScores": {
    "diabetes": 0.6,
    "cardiac": 0.3,
    "obesity": 0.4,
    "stress": 0.5,
    "sleepDisorder": 0.2
  },
  "topRisks": [
    {"condition": "diabetes", "score": 0.6}
  ],
  "trend": "stable"
}
```

All endpoints are documented in the project plan (`pranexusai_project_plan.md`).

---

## 📁 Folder Structure

```
buildForBenglore/
├── client/                  (React Vite frontend)
│   ├── src/
│   │   ├── components/      ← Dev 1, 2, 3 work here
│   │   ├── pages/
│   │   ├── services/        (API layer — pre-wired)
│   │   ├── hooks/
│   │   ├── context/         (Auth)
│   │   └── App.jsx
│   └── package.json
│
├── server/                  (Node/Express backend)
│   ├── models/              (Mongoose schemas)
│   ├── routes/              (API endpoints)
│   ├── middleware/          (JWT auth)
│   ├── services/            (AI caller)
│   ├── server.js            (entry point)
│   └── package.json
│
├── ai-service/              (Python FastAPI microservice)
│   ├── routers/             (11 endpoints)
│   ├── services/            (risk_engine, etc.)
│   ├── utils/               (MongoDB connection)
│   ├── main.py              (entry point)
│   ├── requirements.txt
│   └── .env
│
├── docker-compose.yml       (optional: Docker setup)
├── package.json             (root scripts)
├── .gitignore
├── .env.example
└── pranexusai_project_plan.md (full architecture)
```

---

## 🧪 Testing the APIs

### 1. Test Frontend (without backend)
```bash
cd client && npm run dev
# Open http://localhost:3000
# Should see: Landing page with Login/Register links
```

### 2. Test Backend
```bash
cd server && npm run dev
# Endpoint: http://localhost:5000/api/ping
curl http://localhost:5000/api/ping
# Should return: {"status": "ok"}
```

### 3. Test AI Service
```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# Endpoint: http://localhost:8000/ping
curl http://localhost:8000/ping
# Should return: {"status": "ok", "service": "PranexusAI AI Service"}
```

### 4. Test Full Flow (with mock data)
```bash
# After starting all 3 services, from client:
curl -X POST http://localhost:5000/api/health/analyze \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"userId": "123"}'
```

---

## 📝 Next Steps

1. **Day 1:**
   - Set up MongoDB Atlas connection
   - Run `npm install`
   - Start all 3 services
   - Test basic endpoints

2. **Week 1-2:**
   - Dev 1: Build Glass Body component
   - Dev 2: Build Health Dashboard charts
   - Dev 3: Build Appointment booking
   - AI Dev: Implement real ML models

3. **Week 3:**
   - Integrate frontend with backend
   - Wire up all AI endpoints
   - Add external APIs (OpenWeatherMap, AQICN, Google Calendar)

4. **Week 4:**
   - Polish UI, test flows
   - Deploy to Railway / Render / Fly.io
   - Optimize models

---

## 🛠️ Troubleshooting

### "MongoDB connection failed"
- Check MONGODB_URI in `server/.env`
- Ensure MongoDB Atlas IP whitelist includes your IP
- Test connection: `mongosh "mongodb+srv://..."`

### "Port 3000/5000/8000 already in use"
- Kill existing process: `lsof -i :5000` / `kill -9 <PID>`
- Or change port in `vite.config.js` / `server/.env`

### "Python not found"
- Install Python 3.9+
- Install FastAPI: `pip install -r ai-service/requirements.txt`

### "CORS error from frontend"
- Check `AI_SERVICE_URL` in `server/.env`
- Ensure CORS is enabled in `ai-service/main.py`

---

## 📚 Resources

- **Full Architecture:** `pranexusai_project_plan.md`
- **React Starter:** https://vitejs.dev/guide/ssr.html
- **FastAPI Docs:** https://fastapi.tiangolo.com/
- **MongoDB:** https://www.mongodb.com/docs/
- **JWT Auth:** https://jwt.io/

---

## 🤝 Team Guidelines

- **Use branches:** `dev/feature-name` per person
- **Component organization:** Each dev owns their component folder — minimize merge conflicts
- **API contract:** Agreed on Day 1 — don't change request/response schemas without sync
- **Code style:** Use Prettier (client/server) + Black (Python)
- **Logs:** Centralize logs for debugging (use `winston` / `python logging`)

---

**Questions?** Check the full plan in `pranexusai_project_plan.md` or comment in your component's TODO sections.

Happy building! 🚀
"# Build-for-bangalore" 
