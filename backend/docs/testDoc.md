# MoneyMatters — Testing Documentation

**Framework:** Jest + ts-jest  
**Language:** TypeScript  
**Environment:** Node.js

---

## Table of Contents

1. [Objective](#1-objective)
2. [Testing Philosophy](#2-testing-philosophy)
3. [Testing Layers and Priority](#3-testing-layers-and-priority)
4. [Test Folder Structure](#4-test-folder-structure)
5. [Mock Data Strategy](#5-mock-data-strategy)
6. [Service Layer Tests](#6-service-layer-tests)
7. [Controller Tests](#7-controller-tests)
8. [Middleware Tests](#8-middleware-tests)
9. [Integration Testing](#9-integration-testing)
10. [Mocking Strategy](#10-mocking-strategy)
11. [Jest Configuration](#11-jest-configuration)
12. [Coverage Strategy](#12-coverage-strategy)
13. [Common Mistakes to Avoid](#13-common-mistakes-to-avoid)
14. [Edge Cases](#14-edge-cases)
15. [Viva Preparation](#15-viva-preparation)

---

## 1. Objective

### Goal

Ensure that:

- Core business logic works correctly.
- Edge cases are handled gracefully.
- APIs behave predictably under all input conditions.
- Authentication and authorization are secure.

### Scope

| Category                | Status       |
| ----------------------- | ------------ |
| Unit testing            | Primary      |
| Integration testing     | Optional     |
| UI / end-to-end testing | Out of scope |

---

## 2. Testing Philosophy

### Key Principles

1. **Test logic, not libraries.** Do not test Mongoose, bcrypt, or JWT internals — test how your code uses them.
2. **Mock dependencies.** Every external dependency (database, third-party module) should be mocked in unit tests.
3. **Keep tests isolated.** Each test case must be independent; no shared mutable state between tests.
4. **Prefer clarity over coverage percentage.** A well-written test that catches real bugs is worth more than inflated coverage numbers.

### Primary Focus

The service layer is the highest-priority testing target because it contains all business logic.

---

## 3. Testing Layers and Priority

| Layer       | Priority | Rationale                               |
| ----------- | -------- | --------------------------------------- |
| Services    | High     | Contains all business logic             |
| Middleware  | High     | Handles security and centralized errors |
| Controllers | Medium   | Validates request/response flow         |
| Routes      | Low      | Pure wiring with no logic               |

---

## 4. Test Folder Structure

```
tests/
├── services/
│   ├── auth.service.test.ts
│   ├── transaction.service.test.ts
│   ├── monthly.service.test.ts
│   └── dashboard.service.test.ts
│
├── controllers/
│   ├── auth.controller.test.ts
│   └── transaction.controller.test.ts
│
├── middlewares/
│   ├── auth.middleware.test.ts
│   └── error.middleware.test.ts
│
├── mocks/
│   ├── user.mock.ts
│   ├── transaction.mock.ts
│   └── monthly.mock.ts
```

---

## 5. Mock Data Strategy

### Why Mock?

- Avoid real database calls during testing.
- Ensure deterministic, repeatable results.
- Isolate the unit under test from external dependencies.

### User Mock

```ts
export const mockUser = {
  _id: "user123",
  name: "Test User",
  email: "test@example.com",
  password: "hashed_password",
};
```

### Transaction Mock

```ts
export const mockTransactions = [
  { type: "income", amount: 10000, category: "Freelance" },
  { type: "expense", amount: 3000, category: "Food" },
  { type: "expense", amount: 2000, category: "Travel" },
];
```

### MonthlyPlan Mock

```ts
export const mockMonthlyPlan = {
  userId: "user123",
  month: 1,
  year: 2026,
  savingGoal: 5000,
  achievedSavings: 0,
  goalMet: false,
  isClosed: false,
};
```

---

## 6. Service Layer Tests

### 6.1 AuthService

**Register**

| Test Case            | Expected Outcome                  |
| -------------------- | --------------------------------- |
| Valid input          | Creates user with hashed password |
| Email already exists | Throws `ApiError(400)`            |

**Login**

| Test Case          | Expected Outcome           |
| ------------------ | -------------------------- |
| Valid credentials  | Returns user and JWT token |
| Incorrect password | Throws `ApiError(401)`     |
| Non-existent user  | Throws `ApiError(404)`     |

### 6.2 TransactionService

| Test Case                       | Expected Outcome                |
| ------------------------------- | ------------------------------- |
| Valid transaction data          | Creates and returns transaction |
| Amount is zero or negative      | Throws `ApiError(400)`          |
| Fetch transactions for user     | Returns array of transactions   |
| Delete non-existent transaction | Throws `ApiError(404)`          |

### 6.3 MonthlyService (High Priority)

**setGoal**

| Test Case                          | Expected Outcome       |
| ---------------------------------- | ---------------------- |
| Valid month/year/goal              | Creates monthly plan   |
| Plan already exists for that month | Throws `ApiError(400)` |

**closeMonth**

| Test Case                           | Expected Outcome            |
| ----------------------------------- | --------------------------- |
| Income calculated correctly         | Sum of income transactions  |
| Expense calculated correctly        | Sum of expense transactions |
| Savings derived as income - expense | Correct value               |
| `goalMet` set when savings >= goal  | `true`                      |
| `goalMet` set when savings < goal   | `false`                     |
| Plan does not exist                 | Throws `ApiError(404)`      |
| Plan already closed                 | Throws `ApiError(400)`      |

### 6.4 DashboardService (Critical)

| Test Case                 | Expected Outcome            |
| ------------------------- | --------------------------- |
| Total income calculation  | Correct sum                 |
| Total expense calculation | Correct sum                 |
| Savings calculation       | income - expense            |
| Category aggregation      | Correct per-category totals |
| Goal progress percentage  | (savings / goal) \* 100     |
| Empty transaction list    | Zeros for all KPIs          |
| No monthly plan exists    | Goal defaults to 0          |

---

## 7. Controller Tests

### What to Verify

- The correct service method is invoked with the expected arguments.
- The correct HTTP status code is returned.
- The response body follows the `ApiResponse` structure.

### What NOT to Verify

- Business logic (that belongs to service tests).
- Database behavior (that belongs to repository/integration tests).

---

## 8. Middleware Tests

### Auth Middleware

| Test Case                           | Expected Outcome                    |
| ----------------------------------- | ----------------------------------- |
| Valid token in Authorization header | Calls `next()`, attaches `req.user` |
| Missing Authorization header        | Throws `ApiError(401)`              |
| Malformed or expired token          | Throws `ApiError(401)`              |

### Error Middleware

| Test Case                         | Expected Outcome                         |
| --------------------------------- | ---------------------------------------- |
| Receives an `ApiError`            | Returns matching status code and message |
| Receives an unknown/generic error | Returns `500 Internal Server Error`      |

---

## 9. Integration Testing

Integration tests are optional but valuable for validating end-to-end correctness.

### Suggested Flow

```
Register --> Login --> Add Transaction --> Get Dashboard
```

### What It Validates

- Route wiring is correct.
- Middleware functions as expected in the request pipeline.
- Service and repository layers interact correctly.

---

## 10. Mocking Strategy

| Test Target      | What to Mock                                         |
| ---------------- | ---------------------------------------------------- |
| Service tests    | Repository classes                                   |
| Controller tests | Service classes                                      |
| Middleware tests | `jwt.verify()`, Express `Request`/`Response` objects |

---

## 11. Jest Configuration

### Required Packages

- `jest`
- `ts-jest`
- `@types/jest`

### Configuration Notes

- Use the `ts-jest` default preset for TypeScript compilation.
- Set `testEnvironment` to `node`.
- Test files should match the pattern `**/*.test.ts` or `**/*.spec.ts`.
- Configuration is defined in `jest.config.cjs` at the backend root.

---

## 12. Coverage Strategy

### Targets

| Layer       | Target Coverage |
| ----------- | --------------- |
| Services    | 80-90%          |
| Middleware  | 70%             |
| Controllers | 50%             |

### Note

Coverage percentage is a guideline, not a goal in itself. Prioritize testing correctness and meaningful edge cases over achieving arbitrary coverage thresholds.

---

## 13. Common Mistakes to Avoid

| Mistake                              | Consequence                                  |
| ------------------------------------ | -------------------------------------------- |
| Testing Mongoose operations directly | Wastes time; test your logic, not the ORM    |
| Not mocking dependencies             | Tests become flaky and environment-dependent |
| Writing overly large test cases      | Difficult to debug when failures occur       |
| Ignoring edge cases                  | Bugs remain hidden until production          |

---

## 14. Edge Cases

### Transactions

- No transactions exist for the user.
- User has only income transactions (no expenses).
- User has only expense transactions (no income).

### Monthly Plan

- No plan exists for the requested month.
- Plan has already been closed.

### Dashboard

- Zero income for the current month.
- Negative savings (expenses exceed income).
- No monthly plan set (goal defaults to zero).

---

## 15. Viva Preparation

When asked about the testing approach, a concise answer:

> "We focused primarily on unit testing the service layer since it contains the core business logic. We used mocking to isolate dependencies like repositories, ensuring predictable and reliable tests. Middleware and controllers were tested for correct flow and response handling."
