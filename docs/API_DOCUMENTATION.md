# API Documentation

Base URL: `http://localhost:5000/api`

All authenticated endpoints require an `Authorization` header formatted as:
`Authorization: Bearer <JWT_TOKEN>`

---

## 🔐 1. Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Login user and issue JWT token | No |
| `POST` | `/api/auth/logout` | Invalidate / logout session | Yes |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes |

---

## 👤 2. User Profile (`/api/user`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/user/profile` | Retrieve full user profile & settings | Yes |
| `PUT` | `/api/user/profile` | Update user profile info & target role | Yes |
| `PUT` | `/api/user/change-password` | Update current password | Yes |

---

## 📄 3. Resume & ATS Analysis (`/api/resume`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/resume/upload` | Upload PDF resume (Multipart form-data) | Yes |
| `POST` | `/api/resume/analyze` | Run ATS match & keyword extraction against target role | Yes |
| `GET` | `/api/resume/history` | List uploaded resumes and prior analyses | Yes |
| `GET` | `/api/resume/:id` | Retrieve detailed analysis for a specific resume | Yes |
| `DELETE` | `/api/resume/:id` | Delete resume record and file | Yes |

---

## 💼 4. Job Application Tracker (`/api/jobs`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/jobs` | Retrieve all job applications (filterable by status) | Yes |
| `POST` | `/api/jobs` | Create a new tracked job application | Yes |
| `GET` | `/api/jobs/stats` | Get application metrics by status & timeframe | Yes |
| `GET` | `/api/jobs/:id` | Get details of a single job application | Yes |
| `PUT` | `/api/jobs/:id` | Update job details or move Kanban column | Yes |
| `PATCH` | `/api/jobs/:id/status`| Update application status directly | Yes |
| `DELETE` | `/api/jobs/:id` | Delete job entry | Yes |

---

## 🎯 5. Skills & Gap Analysis (`/api/skills`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/skills/roles` | List available 20 target roles | Yes |
| `GET` | `/api/skills/catalog` | Get catalog of all supported skills | Yes |
| `GET` | `/api/skills/my-skills` | Get authenticated user's assessed skills | Yes |
| `POST` | `/api/skills/assess` | Submit or update skill proficiency levels | Yes |
| `POST` | `/api/skills/gap-analysis` | Compare user skills against target role requirements | Yes |
| `GET` | `/api/skills/resources/:skillName` | Get curated learning resources for a skill | Yes |

---

## 📅 6. Study Planner (`/api/study-plan`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/study-plan` | Retrieve current active study plan | Yes |
| `POST` | `/api/study-plan/generate` | Auto-generate study plan from skill gaps & timeframe | Yes |
| `PUT` | `/api/study-plan/:id/milestone` | Toggle daily checklist milestone completion | Yes |
| `GET` | `/api/study-plan/history` | List previous completed study plans | Yes |
| `DELETE` | `/api/study-plan/:id` | Archive or delete study plan | Yes |

---

## 💻 7. Coding Tracker (`/api/coding`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/coding` | List all logged problems (with filters & search) | Yes |
| `POST` | `/api/coding` | Log a newly solved coding problem | Yes |
| `GET` | `/api/coding/stats` | Aggregated statistics by difficulty, topic, platform | Yes |
| `GET` | `/api/coding/weak-topics` | Algorithmic topics needing reinforcement | Yes |
| `PUT` | `/api/coding/:id` | Update solution notes or status | Yes |
| `DELETE` | `/api/coding/:id` | Remove logged problem | Yes |

---

## 🎙️ 8. Mock Interview (`/api/mock-interview`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/mock-interview/start` | Start mock interview session for a given role/type | Yes |
| `POST` | `/api/mock-interview/submit`| Submit answers and receive AI scoring feedback | Yes |
| `GET` | `/api/mock-interview/history`| List past interview sessions and score trajectories | Yes |
| `GET` | `/api/mock-interview/:id` | View specific interview answers, rubrics & review | Yes |

---

## 📊 9. Dashboard & Readiness (`/api/dashboard`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/dashboard/readiness` | Get aggregate 0-100% Readiness Score & component weights | Yes |
| `GET` | `/api/dashboard/summary` | Consolidated dashboard KPIs, next steps, recent activities | Yes |
