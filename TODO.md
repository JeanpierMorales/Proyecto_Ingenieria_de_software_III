# TODO List for Switching to MySQL Backend and Adding Testing Infrastructure

## Backend Setup

- [ ] Create `backend/` directory structure
- [ ] Create `backend/package.json` with Express, mysql2, cors, dotenv deps
- [ ] Create `backend/server.js` for Express app setup
- [ ] Create `backend/db.js` for MySQL connection (root, no password, port 3305)
- [ ] Create `schema.sql` for database table creation (projects, budgets, reports, users, purchases, strategies, quotations)
- [ ] Create `data.sql` for inserting mock data into tables
- [ ] Create `backend/routes/projects.js` with CRUD endpoints
- [ ] Create `backend/routes/budgets.js` with CRUD endpoints
- [ ] Create `backend/routes/reports.js` with CRUD endpoints
- [ ] Create `backend/routes/users.js` with CRUD endpoints
- [ ] Create `backend/routes/purchases.js` with CRUD endpoints
- [ ] Create `backend/routes/strategies.js` with CRUD endpoints
- [ ] Create `backend/routes/quotations.js` with CRUD endpoints

## Frontend Updates

- [ ] Update `src/services/api.js` to replace mock functions with fetch calls to backend (http://localhost:3001/api/\*)
- [ ] Add testing dependencies to `package.json` (jest, supertest, artillery, etc.)

## Testing Infrastructure

- [ ] Create `tests/` directory structure (unit/, integration/, performance/, security/)
- [ ] Create `tests/unit/validations.test.js` for unit tests on validations
- [ ] Create `tests/integration/api.test.js` for integration tests on API endpoints
- [ ] Create `tests/performance/load.test.js` for performance tests with Artillery
- [ ] Create `tests/security/basic.test.js` for basic security checks
- [ ] Add npm scripts in package.json for running tests

## Verification and Testing

- [ ] Run schema.sql and data.sql in XAMPP MySQL
- [ ] Install backend dependencies and run backend server
- [ ] Test frontend with backend integration
- [ ] Run all tests and verify results
- [ ] Ensure system runs without issues
