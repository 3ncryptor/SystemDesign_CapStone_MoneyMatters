# MoneyMatters — Developer Documentation

**Version:** 1.0  
**Stack:** TypeScript, Node.js, Express, MongoDB (Mongoose)  
**Authors:** Aryan Vibhuti, Rajdeep Sanyal, Piyush Yadav, Meet Ahuja

---

## Table of Contents

1. [Objective](#1-objective)
2. [Problem Statement](#2-problem-statement)
3. [High-Level Architecture](#3-high-level-architecture)
4. [Folder Structure](#4-folder-structure)
5. [Data Models](#5-data-models)
6. [Authentication](#6-authentication)
7. [Transaction System](#7-transaction-system)
8. [Monthly Plan System](#8-monthly-plan-system)
9. [Dashboard System](#9-dashboard-system)
10. [Service Layer Responsibilities](#10-service-layer-responsibilities)
11. [API Reference](#11-api-reference)
12. [Utilities](#12-utilities)
13. [Error Handling](#13-error-handling)
14. [Security](#14-security)
15. [Design Decisions](#15-design-decisions)
16. [Out of Scope](#16-out-of-scope)
17. [Viva Preparation Guide](#17-viva-preparation-guide)
18. [Summary](#18-summary)

---

## 1. Objective

### Goal

Build a money management web application that allows users to:

- Track income and expenses.
- Define monthly saving goals.
- Monitor financial performance via dashboard analytics.

### Core Philosophy

- Demonstrate OOP and SOLID principles in practice.
- Maintain a clean, layered architecture.
- Keep the codebase simple enough for team-wide understanding.
- Provide sufficient structure and depth for academic evaluation.

---

## 2. Problem Statement

Users — especially freelancers — face the following challenges:

- Irregular income streams with no structured tracking.
- Untracked or loosely tracked expenses.
- No quantitative method for measuring monthly savings against goals.

### Proposed Solution

A system that:

- Logs all financial activity (income and expenses) as transactions.
- Supports monthly goal setting for savings targets.
- Calculates savings dynamically from transaction data.
- Provides visual insights through a consolidated dashboard.

---

## 3. High-Level Architecture

```
Client --> Routes --> Controller --> Service --> Repository --> Model --> Database
```

### Layer Responsibilities

| Layer        | Responsibility                                    |
| ------------ | ------------------------------------------------- |
| Routes       | Define HTTP endpoints and map them to controllers |
| Controllers  | Handle request parsing and response formatting    |
| Services     | Encapsulate business logic                        |
| Repositories | Abstract database operations                      |
| Models       | Define Mongoose schema definitions                |
| Middleware   | Address cross-cutting concerns (auth, errors)     |

---

## 4. Folder Structure

```
src/
├── config/
│   └── db.ts
│
├── models/
│   ├── user.model.ts
│   ├── transaction.model.ts
│   ├── category.model.ts
│   └── monthlyPlan.model.ts
│
├── repositories/
│   ├── user.repository.ts
│   ├── transaction.repository.ts
│   ├── category.repository.ts
│   └── monthlyPlan.repository.ts
│
├── services/
│   ├── auth.service.ts
│   ├── transaction.service.ts
│   ├── monthly.service.ts
│   └── dashboard.service.ts
│
├── controllers/
│   ├── auth.controller.ts
│   ├── transaction.controller.ts
│   ├── monthly.controller.ts
│   └── dashboard.controller.ts
│
├── routes/
│   ├── auth.routes.ts
│   ├── transaction.routes.ts
│   ├── monthly.routes.ts
│   └── dashboard.routes.ts
│
├── middlewares/
│   ├── auth.middleware.ts
│   └── error.middleware.ts
│
├── utils/
│   ├── ApiError.ts
│   ├── ApiResponse.ts
│   └── asyncHandler.ts
│
├── types/
│   └── index.ts
│
├── app.ts
└── server.ts
```

---

## 5. Data Models

### 5.1 User

```ts
{
  name: string;
  email: string;
  password: string;
}
```

### 5.2 Transaction

```ts
{
  userId: ObjectId;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: Date;
}
```

### 5.3 Category

```ts
{
  name: string;
}
```

Categories are static and seeded at application startup. No CRUD operations are exposed for this entity.

### 5.4 MonthlyPlan

```ts
{
  userId: ObjectId;
  month: number;
  year: number;
  savingGoal: number;
  achievedSavings: number;
  goalMet: boolean;
  isClosed: boolean;
}
```

---

## 6. Authentication

### Features

- User registration with password hashing.
- User login with credential verification.
- JWT token generation upon successful login.
- Protected routes via authentication middleware.

### Flow

```
Login --> Generate JWT --> Return Token --> Middleware verifies token on subsequent requests
```

### Middleware Responsibilities

1. Extract the token from the `Authorization` header.
2. Validate and decode the token.
3. Attach the authenticated `userId` to the request object.

---

## 7. Transaction System

### Features

- Add an income or expense transaction.
- Fetch all transactions for the authenticated user.
- Delete a transaction by ID.

### Design Decision

Income and expenses are unified under a single `Transaction` model, differentiated by the `type` field (`"income"` or `"expense"`). There is no separate salary or income entity — this design accommodates freelancers and users with multiple income sources.

---

## 8. Monthly Plan System

### Purpose

Track user financial goals on a per-month basis.

### Lifecycle

| Phase            | Action                                |
| ---------------- | ------------------------------------- |
| Start of month   | User sets a saving goal               |
| During the month | User adds income/expense transactions |
| End of month     | User manually closes the month        |

### Month Closing Logic

```
income          = sum of all income transactions for the month
expense         = sum of all expense transactions for the month
achievedSavings = income - expense
goalMet         = achievedSavings >= savingGoal
```

### Why Manual Closing?

The month is closed via an explicit API call rather than an automated cron job. This decision was made to:

- Reduce infrastructure complexity.
- Keep the system easy to reason about and explain.
- Avoid dependency on background job schedulers.

---

## 9. Dashboard System

### Endpoint

```
GET /api/dashboard
```

### Response Structure

#### KPI Cards

```ts
{
  earnings: number; // Current month income
  spendings: number; // Current month expenses
  currentSavings: number; // Sum of achievedSavings across all closed months
}
```

#### Category Breakdown

```ts
[
  { category: "Food", amount: 5000 },
  { category: "Transport", amount: 2000 },
];
```

#### Income vs. Expense Distribution

```ts
{
  income: number;
  expense: number;
  savings: number;
}
```

#### Goal Progress

```ts
{
  goal: number;
  currentSavings: number;
  percentage: number;
  goalMet: boolean;
}
```

### Design Constraint

All analytics are computed dynamically at request time. No pre-aggregated or redundantly stored values are maintained.

---

## 10. Service Layer Responsibilities

| Service              | Operations                                                 |
| -------------------- | ---------------------------------------------------------- |
| `AuthService`        | Register user, login user                                  |
| `TransactionService` | Create transaction, fetch transactions, delete transaction |
| `MonthlyService`     | Set saving goal, close month, fetch monthly data           |
| `DashboardService`   | Aggregate analytics from transactions and monthly plans    |

---

## 11. API Reference

### Authentication

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | Login and get token |

### Transactions

| Method | Endpoint                | Description           |
| ------ | ----------------------- | --------------------- |
| POST   | `/api/transactions`     | Create a transaction  |
| GET    | `/api/transactions`     | Get user transactions |
| DELETE | `/api/transactions/:id` | Delete a transaction  |

### Monthly Plan

| Method | Endpoint                  | Description               |
| ------ | ------------------------- | ------------------------- |
| POST   | `/api/monthly-plan`       | Set a monthly saving goal |
| GET    | `/api/monthly-plan`       | Get monthly plan data     |
| POST   | `/api/monthly-plan/close` | Close the current month   |

### Dashboard

| Method | Endpoint         | Description                   |
| ------ | ---------------- | ----------------------------- |
| GET    | `/api/dashboard` | Get aggregated dashboard data |

---

## 12. Utilities

### ApiResponse

Standardized response wrapper used across all controllers.

```ts
{
  success: boolean;
  message: string;
  data: any;
}
```

### ApiError

Custom error class that extends `Error` with an HTTP status code. Thrown from services and caught by the centralized error middleware.

### asyncHandler

Higher-order function that wraps async route handlers, catching rejected promises and forwarding them to Express error middleware. Eliminates repetitive try-catch blocks in controllers.

---

## 13. Error Handling

### Centralized Error Middleware

A single Express error-handling middleware (`error.middleware.ts`) catches all errors propagated through `next()` or thrown within `asyncHandler`-wrapped routes.

### Response Format

All error responses follow a consistent structure:

```ts
{
  success: false;
  message: "Descriptive error message";
}
```

---

## 14. Security

| Measure                 | Implementation                                      |
| ----------------------- | --------------------------------------------------- |
| Password hashing        | bcrypt with salt rounds                             |
| Authentication          | JWT-based stateless authentication                  |
| Route protection        | Auth middleware on all non-public endpoints         |
| Data isolation          | Users can only access their own data (userId check) |
| Sensitive data exposure | Passwords are never returned in API responses       |

---

## 15. Design Decisions

| Decision                      | Rationale                                            |
| ----------------------------- | ---------------------------------------------------- |
| Repository pattern            | Decouples business logic from data access (SOLID)    |
| No separate salary entity     | Unified transaction model supports freelancers       |
| Static categories             | Reduces complexity; no CRUD overhead                 |
| Manual month closing          | Avoids cron/scheduler dependency; simpler to explain |
| Single dashboard endpoint     | Clean API surface; all analytics in one request      |
| Dynamic analytics computation | No data duplication; always reflects current state   |

---

## 16. Out of Scope

The following features are intentionally excluded from this version:

- Pagination and filtering on list endpoints.
- Role-based access control (RBAC).
- Real-time updates (WebSockets).
- Scheduled jobs (cron).
- Third-party API integrations.

---

## 17. Viva Preparation Guide

Each team member should be able to explain the following:

1. **Architecture flow** — How a request travels from route to database and back.
2. **Service layer justification** — Why business logic is separated from controllers and repositories.
3. **Savings calculation** — How `achievedSavings` is derived from transaction data at month close.
4. **Monthly plan separation** — Why monthly plans are a distinct entity rather than part of the user model.
5. **JWT authentication** — Token generation, storage, validation, and how middleware protects routes.

---

## 18. Summary

MoneyMatters delivers:

- A clean, layered architecture following OOP and SOLID principles.
- Real-world financial logic (income tracking, expense tracking, savings goals).
- Controlled complexity suitable for a capstone-level project.
- Strong explainability for academic evaluation and team collaboration.
