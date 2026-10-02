# Local Development Setup Guide

Follow this guide to get Career Copilot running locally on your workstation.

---

## 🛠️ System Prerequisites

- **Node.js**: v18.0 or higher (v20+ recommended). Check with `node -v`.
- **NPM**: v9.0 or higher. Check with `npm -v`.
- **PostgreSQL**: v13+ running on port `5432` (or remote PostgreSQL URI).
- **Git**: Installed for version control.

---

## 📦 Step-by-Step Installation

### 1. Database Setup
Ensure PostgreSQL service is running. Create a dedicated database:
```sql
CREATE DATABASE career_copilot;
```

### 2. Configure Environment Files

**Backend Environment**:
Copy `backend/.env.example` to `backend/.env`:
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=career_copilot
DB_USER=postgres
DB_PASSWORD=your_postgres_password
JWT_SECRET=super_secret_jwt_key_career_copilot_2026
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

**Frontend Environment**:
Copy `frontend/.env.example` to `frontend/.env.local`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Install All Dependencies
From the repository root:
```bash
npm run install:all
```

### 4. Seed Database
Populate target roles, interview questions, skills catalog, and resources:
```bash
npm run seed
```

### 5. Launch the Development Environment
From the root directory:
```bash
npm run dev
```

Your applications will be active at:
- **Client (Vite React)**: `http://localhost:5173`
- **Server (Express API)**: `http://localhost:5000`
- **API Health Check**: `http://localhost:5000/api/health`
