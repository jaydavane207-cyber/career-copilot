# Career Copilot 🚀
### Free Career Prep Platform for Indian Tech Jobs (MVP)

**Career Copilot** is a free, full-stack career preparation platform designed to help tech aspirants crack top Indian product startups, high-growth scale-ups, and global MNC engineering roles (Bengaluru, Hyderabad, Gurugram, Pune, Noida, and Remote).

---

## 🏗️ Tech Stack

- **Backend**: Node.js, Express.js, PostgreSQL (Sequelize ORM), JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, CORS, Dotenv.
- **Frontend**: React 18, Tailwind CSS, React Router v6 (`react-router-dom`), Axios, Lucide Icons, Vite.
- **Database**: PostgreSQL (with automated schema creation and offline SQLite fallback for instant local testing).

---

## 🌟 Key Architecture & Features

### 1. Backend (Express + PostgreSQL)
- **User Model**: `users` table schema:
  - `id`: UUID primary key
  - `name`: VARCHAR(255) (with virtual alias support for `fullName`)
  - `email`: VARCHAR(255) (unique, email format validation)
  - `password`: VARCHAR(255) (hashed with `bcryptjs` salt rounds 10)
  - `targetRole`: VARCHAR(255) (defaults to in-demand Indian tech roles like *SDE-1*, *Full Stack Developer*, etc.)
  - `createdAt` & `updatedAt`: Timestamps
- **Authentication System with JWT**:
  - `POST /api/auth/register`: Validates name, email format, and password (enforcing minimum 8 characters). Generates signed JWT.
  - `POST /api/auth/login`: Authenticates email and compares password hash via bcrypt. Issues signed JWT.
  - `GET /api/auth/me`: Returns session details for the authenticated user.
  - `POST /api/auth/logout`: Clears session state.
- **User Profile Endpoints**:
  - `GET /api/user`: Fetches current authenticated user profile.
  - `POST /api/user`: Updates user name and target tech role.
- **Environment Configuration**:
  - `.env` and `.env.example` configured with `DATABASE_URL` and `JWT_SECRET`.
- **Database Schema**:
  - PostgreSQL schema definition provided in `backend/schema.sql`.

### 2. Frontend (React + Tailwind CSS)
- **Landing Page (`/`)**:
  - Tailored for Indian Tech Jobs (SDE-1, Full Stack, Backend, DevOps, Data Engineering).
  - Indian tech market benchmarks (CTC ranges in LPA across Bengaluru, Hyderabad, Gurugram).
  - High-visibility **Sign-Up CTA** buttons.
  - Interactive **Google Sign-up Mockup** CTA in hero section.
- **Google Sign-Up / Sign-In Mockup**:
  - Displays authentic Google SVG branding.
  - Explains the MVP mock status with options to continue with email or 1-click demo fill.
- **Email/Password Sign-Up Form (`/signup`)**:
  - Full Name, Email, and Indian Tech Target Role selector.
  - Real-time password validation indicator (minimum 8 characters).
  - Client-side error handling and server response banners.
- **Login Page (`/login`)**:
  - Email & password form with quick **One-Click Demo Fill** (`demo@careercopilot.io` / `password123`).
  - Google Sign-in mockup button.
- **Protected Dashboard (`/dashboard`)**:
  - Protected by `ProtectedRoute` (redirects unauthenticated visitors to `/login` preserving intended destination).
  - Displays user profile summary with in-place profile editor wired directly to `POST /api/user`.
  - Unified 0-100% Career Readiness Score, ATS resume checker, DSA practice tracker, and application pipeline.
- **Navbar with User Profile Dropdown**:
  - Sticky responsive header with navigation.
  - Profile dropdown with user initials, email, target role badge, and **Sign Out** button.
- **React Router Navigation**:
  - Client-side routing with clean protected routes.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18 or higher (v20+ recommended)
- **PostgreSQL**: (Optional for local testing; app includes zero-config fallback if local PostgreSQL server is not started)

### 2. Configuration (`.env`)
In `backend/.env` (and template `backend/.env.example`):
```env
# Application Port
PORT=5000
NODE_ENV=development

# PostgreSQL Connection URL
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/career_copilot

# Database dialect ('postgres' or 'sqlite' for zero-config offline mode)
DB_DIALECT=sqlite

# JWT Secret & Expiry
JWT_SECRET=career_copilot_super_secure_jwt_secret_key_2026_xyz
JWT_EXPIRES_IN=7d

# Frontend CORS
CLIENT_URL=http://localhost:5173
```

### 3. Install Dependencies
```bash
# From the project root
npm run install:all
```

### 4. Seed Pre-loaded Demo Data
```bash
npm run seed
```
Creates demo account:
- **Email**: `demo@careercopilot.io`
- **Password**: `password123`

### 5. Run the Verification Tests
To run automated tests verifying password validation (min 8 chars), email validation, duplicate prevention, JWT issuance, and GET/POST `/api/user`:
```bash
cd backend
npm test
```

### 6. Start Development Servers
```bash
# From the project root (starts both backend and frontend concurrently)
npm run dev
```

- **Backend API**: `http://localhost:5000`
- **Frontend App**: `http://localhost:5173`

---

## 🗄️ PostgreSQL Database Schema

To initialize the schema in PostgreSQL directly:
```bash
psql -U postgres -d career_copilot -f backend/schema.sql
```

Schema:
```sql
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    "targetRole" VARCHAR(255) DEFAULT 'Full Stack Developer',
    "experienceLevel" VARCHAR(100) DEFAULT 'Entry-Level',
    bio TEXT,
    "avatarUrl" VARCHAR(500),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📄 License
MIT
