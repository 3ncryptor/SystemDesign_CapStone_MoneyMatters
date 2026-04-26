# 💰 MoneyMatters

> A full-stack personal finance management application built as a System Design Capstone project.

MoneyMatters helps users track their income, expenses, transactions, and monthly budgets — all in one clean, modern interface.

---

## 🚀 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + TypeScript | UI Framework |
| Vite 8 | Build tool & dev server |
| Tailwind CSS v4 | Utility-first styling |
| Framer Motion | Animations |
| Recharts | Data visualization |
| React Router v7 | Client-side routing |
| Axios | HTTP client |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| TypeScript | Type safety |
| MongoDB + Mongoose | Database & ODM |
| JWT (jsonwebtoken) | Authentication |
| bcrypt | Password hashing |
| tsx | TypeScript execution & hot reload |

---

## 📁 Project Structure

```
SystemDesign_CapStone_MoneyMatters/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── services/          # Business logic
│   │   ├── repositories/      # Database queries
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # API route definitions
│   │   ├── middlewares/       # Auth, error handling
│   │   ├── utils/             # ApiResponse, ApiError, asyncHandler
│   │   ├── app.ts             # Express app setup
│   │   └── server.ts          # Entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/            # Reusable UI components (shadcn-style)
│   │   │   │   ├── demo.tsx   # AuthSwitch (Login/Register) component
│   │   │   │   └── auth-switch.tsx
│   │   │   ├── AppLayout.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx  # Global auth state (JWT + localStorage)
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Transactions.tsx
│   │   │   ├── MonthlyPlan.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── services/
│   │   │   └── api.ts         # Axios instance with JWT interceptor
│   │   ├── lib/
│   │   │   └── utils.ts       # cn() utility for Tailwind class merging
│   │   ├── App.tsx            # Router & route definitions
│   │   └── main.tsx
│   └── package.json
│
└── package.json               # Monorepo root
```

---

## ✨ Features

- **Authentication** — Register & login with animated sign-in/sign-up switcher (black & white theme)
- **Dashboard** — Overview of income, expenses, and savings with charts
- **Transactions** — Add, view, and categorize income/expense transactions
- **Monthly Plan** — Set and track monthly budget goals
- **Protected Routes** — JWT-based auth guard; unauthenticated users are redirected to login
- **Persistent Session** — Token stored in `localStorage`; session survives page refresh

---

## ⚙️ Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally on port `27017`

> **macOS note:** Port `5000` is used by AirPlay Receiver. The backend runs on port `4000` by default.

---

### 1. Clone the repository

```bash
git clone https://github.com/3ncryptor/SystemDesign_CapStone_MoneyMatters.git
cd SystemDesign_CapStone_MoneyMatters
```

### 2. Install all dependencies

```bash
# Root + backend + frontend
npm install
npm install --prefix backend
npm install --prefix frontend
```

### 3. Configure environment variables

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/money-management
JWT_SECRET=your_super_secret_key_here
```

### 4. Start the backend

```bash
cd backend
npm run dev
# Server running on port 4000
```

### 5. Start the frontend

```bash
cd frontend
npm run dev
# Vite dev server at http://localhost:5173
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | Get all user transactions |
| POST | `/api/transactions` | Create a new transaction |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Get summary stats |

### Monthly Plan
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/monthly-plan` | Get monthly budget |
| POST | `/api/monthly-plan` | Set monthly budget |

> All endpoints except `/api/auth/*` require `Authorization: Bearer <token>` header.

---

## 🗃️ Data Models

### User
```ts
{
  name: string
  email: string       // unique
  password: string    // bcrypt hashed
  createdAt: Date
  updatedAt: Date
}
```

### Transaction
```ts
{
  userId: ObjectId    // ref: User
  amount: number
  type: "income" | "expense"
  category: string
  date: Date
}
```

---

## 👥 Team

| Name | GitHub |
|------|--------|
| Aryan Vibhuti | [@3ncryptor](https://github.com/3ncryptor) |
| Rajdeep Sanyal | — |
| Piyush Yadav | — |
| Meet Ahuja | [@MeetAhujaa](https://github.com/MeetAhujaa) |

---

## 📄 License

MIT © MoneyMatters Team
