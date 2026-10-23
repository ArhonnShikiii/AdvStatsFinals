# ADVSTAT System

Interactive Advanced Statistics web application for **Simple Linear Regression** and **Hypothesis Testing (Z-test)**.

Built with **Next.js (TypeScript)**, **Prisma + Neon (PostgreSQL)**, **JWT auth**, **Chart.js**, and a **glassmorphism** UI. Ready for deployment on **Vercel**.

---

## Features

### 1. Simple Linear Regression
- Enter / edit / delete X–Y data points
- Regression equation Y = a + bX
- Correlation coefficient r and r²
- Strength of relationship (very strong → very weak)
- Interactive scatter diagram with regression line

### 2. Hypothesis Testing (One-sample Z-test)
- State H₀ and H₁
- Choose left / right / two-tailed test
- Select significance level α (0.01, 0.05, 0.10)
- Computes Z-statistic, critical values, approximate p-value
- Automatic decision (Reject / Fail to reject H₀)
- Normal curve graph with shaded rejection regions

### 3. Auth & Design
- Register / Login / Logout (Prisma + Neon + bcrypt + JWT cookie)
- Protected dashboard & analysis pages
- Glassmorphism UI with animated gradient background
- Fully interactive buttons and forms

---

## Quick Start (Local)

### 1. Prerequisites
- Node.js 18+
- A free Neon Postgres database: https://neon.tech

### 2. Install

```bash
cd advstat-system
npm install
```

### 3. Environment

```bash
cp .env.example .env
```

Edit `.env`:

```
DATABASE_URL="postgresql://user:password@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="paste-a-long-random-string-here-at-least-32-chars"
```

Generate a secret:

```bash
openssl rand -base64 32
```

### 4. Database

```bash
npx prisma db push
```

### 5. Run

```bash
npm run dev
```

Open http://localhost:3000

---

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Import the repo in https://vercel.com
3. Add Environment Variables:
   - DATABASE_URL → your Neon connection string
   - JWT_SECRET → your secret
4. Deploy. Vercel runs prisma generate via postinstall/build.

Tip: In Neon use the **pooled** connection string for serverless.

---

## Project Structure

```
advstat-system/
├── prisma/schema.prisma
├── src/
│   ├── app/
│   │   ├── (auth)/login & register
│   │   ├── api/auth/
│   │   ├── dashboard/
│   │   ├── regression/
│   │   ├── hypothesis/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── ScatterChart.tsx
│   │   └── NormalCurveChart.tsx
│   └── lib/
│       ├── prisma.ts
│       ├── auth.ts
│       └── stats.ts
├── .env.example
└── package.json
```

---

## Notes for the Paper / Demo

Regression strength scale:
- |r| ≥ 0.9 → Very strong
- |r| ≥ 0.7 → Strong
- |r| ≥ 0.5 → Moderate
- |r| ≥ 0.3 → Weak
- |r| > 0 → Very weak

Z-test is one-sample for population mean (σ known).

Screenshots for Manual: Login, Dashboard, Regression (with chart), Hypothesis (decision + curve).

---

Academic / educational use for ADVSTAT Final Output.
