# ⚡ StudyQuizAI

> Upload any PDF → Get an AI-powered quiz with per-option explanations → Pay with Razorpay (India + International)

**Rebranded and upgraded from [QuizAPP](https://github.com/paraspahwa/QuizAPP)** with a polished landing page, Razorpay payments (one-time + subscriptions), and free-tier usage limits.

---

## What's New (vs QuizAPP)

| Feature | QuizAPP | StudyQuizAI |
|---------|---------|-------------|
| Branding | Generic | ⚡ StudyQuizAI with landing page |
| Payments | ❌ None | ✅ Razorpay (UPI, cards, international) |
| Plans | — | Monthly (₹199) / Yearly (₹1,499) |
| Usage Limits | Unlimited | Free: 3/day · Pro: Unlimited |
| Landing Page | ❌ | ✅ Full marketing page |
| Pricing Page | ❌ | ✅ With plan comparison |
| Quiz Features | ✅ All preserved | ✅ All preserved + usage bar |

---

## Project Structure

```
StudyQuizAI/
├── backend/
│   ├── main.py               # FastAPI routes (quiz + payments + usage limits)
│   ├── pdf_parser.py          # PDF text extraction + chunking
│   ├── quiz_generator.py      # OpenAI GPT-4o quiz generation
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Stage manager (landing → upload → quiz → results)
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── hooks/
│   │   │   └── useRazorpay.js # Razorpay checkout hook
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   └── PricingPage.jsx
│   │   └── components/
│   │       ├── UploadSection.jsx   # PDF upload + usage bar
│   │       ├── QuizSection.jsx     # Quiz renderer
│   │       ├── QuizCard.jsx        # Per-question card
│   │       └── ResultsSummary.jsx  # Score screen
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── nginx.conf
│   └── Dockerfile
│
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## Quick Start

### 1. Clone & configure

```bash
git clone https://github.com/paraspahwa/StudyQuizAI.git
cd StudyQuizAI
cp .env.example .env
```

Edit `.env` and add your keys:
- `OPENAI_API_KEY` — from [OpenAI](https://platform.openai.com/api-keys)
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` — from [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys)

### 2. Run with Docker

```bash
docker compose up --build
```

Visit: **http://localhost:3000**

### 3. Create subscription plans (one-time)

```bash
curl -X POST http://localhost:8000/payment/create-plan
```

Copy the returned plan IDs into your `.env`:
```
VITE_RAZORPAY_MONTHLY_PLAN_ID=plan_xxxxx
VITE_RAZORPAY_YEARLY_PLAN_ID=plan_yyyyy
```

---

## Local Development (without Docker)

**Backend:**
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## Payment Flow

```
User clicks "Get Pro"
    ↓
Frontend → POST /payment/create-order → Razorpay API
    ↓
Razorpay Checkout popup opens (UPI / Card / Net Banking)
    ↓
User pays → Razorpay returns payment details
    ↓
Frontend → POST /payment/verify-payment → Backend verifies signature
    ↓
✅ User marked as Pro → Unlimited quizzes
```

---

## Testing Payments

| Method | Test Credentials |
|--------|-----------------|
| Card | `4111 1111 1111 1111`, any future expiry, any CVV |
| UPI | `success@razorpay` |
| Net Banking | Any bank (auto-succeeds in test mode) |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/upload-and-generate` | Generate quiz from PDF |
| GET | `/usage-status` | Check free/pro usage |
| POST | `/payment/create-order` | Create one-time payment |
| POST | `/payment/verify-payment` | Verify payment |
| POST | `/payment/create-plan` | Create subscription plans |
| POST | `/payment/create-subscription` | Start subscription |
| POST | `/payment/verify-subscription` | Verify subscription |
| POST | `/payment/webhook` | Razorpay webhook handler |
| GET | `/health` | Health check |

---

## Going Live Checklist

- [ ] Replace `rzp_test_` keys with `rzp_live_` keys
- [ ] Enable international payments in Razorpay Dashboard
- [ ] Set webhook URL: `https://yourdomain.com/payment/webhook`
- [ ] Replace in-memory storage with a real database (PostgreSQL/MongoDB)
- [ ] Add user authentication (email/Google OAuth)
- [ ] Test with a real ₹1 payment
- [ ] Update CORS origins in `main.py`
- [ ] Deploy backend + frontend (Railway / Render / AWS)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite |
| Backend | Python 3.11, FastAPI |
| AI | OpenAI GPT-4o |
| Payments | Razorpay |
| PDF Parsing | pdfplumber |
| Containerization | Docker, Docker Compose |
| Reverse Proxy | nginx |

---

## License

MIT
