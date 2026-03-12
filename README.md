# SubTrack — Subscription Tracker

> Stop losing money to forgotten subscriptions. Track all your subscriptions in one place, see your true monthly spend, and catch renewals before they hit.

---

## Tech Stack

- **Frontend:** React 18 + Vite, plain CSS with CSS variables, dark theme
- **Backend:** FastAPI (Python 3.11) + SQLAlchemy ORM
- **Database:** PostgreSQL 15
- **Auth:** JWT (PyJWT) + bcrypt password hashing
- **Payments:** Razorpay (Pro plan upgrade)
- **Deploy:** Docker + Docker Compose

---

## Quick Start

### Option A — Docker (Recommended)

```bash
# 1. Clone and enter the repo
git clone <repo-url>
cd subtrack

# 2. Copy env file
cp .env.example .env
# Edit .env with your SECRET_KEY and optionally Razorpay keys

# 3. Start everything
docker compose up --build

# App runs at:
#   Frontend: http://localhost:3000
#   Backend:  http://localhost:8000
#   API docs: http://localhost:8000/docs
```

### Option B — Local Development

**Backend:**
```bash
cd backend
pip install -r requirements.txt
# Set DATABASE_URL in your environment
uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# Runs at http://localhost:5173
```

---

## Features

### Free Plan (forever free)
- Track up to 10 subscriptions
- Monthly & yearly spend totals
- Category organization
- Renewal date tracking
- Basic analytics

### Pro Plan ($9/month)
- Unlimited subscriptions
- Full analytics dashboard
- Renewal alerts (30-day view)
- Spend by category breakdown
- Priority support

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/subscriptions` | List subscriptions |
| POST | `/api/subscriptions` | Add subscription |
| PUT | `/api/subscriptions/{id}` | Update subscription |
| DELETE | `/api/subscriptions/{id}` | Delete subscription |
| GET | `/api/analytics` | Get spend analytics |
| POST | `/api/payments/create-order` | Create Razorpay order |
| POST | `/api/payments/verify` | Verify payment |

Full interactive docs at `/docs` when running locally.

---

## Environment Variables

See `.env.example` for all required variables. Minimum required:
- `DATABASE_URL` — PostgreSQL connection string
- `SECRET_KEY` — JWT signing secret (32+ chars)

Optional (for Pro plan payments):
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `VITE_RAZORPAY_KEY_ID`
