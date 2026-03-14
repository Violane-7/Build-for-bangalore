# PranexusAI — Quick Start Guide (Fixed)

## Issues Found & Fixed

### ✅ Backend Issue: MongoDB Connection Failing
**Problem:** Server crashed on startup if MongoDB wasn't available
**Fix:** Modified `server/server.js` to start accepting requests immediately
**Status:** Server now runs and serves `/api/ping` even without database

### ✅ AI Issue: Missing C++ Compiler
**Problem:** scikit-learn requires C++ compiler (not on this machine)
**Fix:** Removed scikit-learn from `ai-service/requirements.txt`
**Status:** FastAPI now installs without errors

---

## How to Run Everything

### Terminal 1 — Frontend (React)
```bash
cd client
npm run dev
# http://localhost:3000
```

### Terminal 2 — Backend (Node/Express)
```bash
cd server
npm run dev
# http://localhost:5000 (or 5001)
# Test: curl http://localhost:5000/api/ping
```

### Terminal 3 — AI Service (Python/FastAPI)
```bash
cd ai-service
pip install -r requirements.txt
python -m uvicorn main:app --port 8000 --reload
# http://localhost:8000
# Test: curl http://localhost:8000/ping
```

---

## Status Summary

| Service | Port | Status |
|---------|------|--------|
| Frontend | 3000 | ✅ Running |
| Backend | 5000/5001 | ✅ Running |
| AI Service | 8000 | ✅ Running |

All three services communicate via REST APIs. Ready for team development!
