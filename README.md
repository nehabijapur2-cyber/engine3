# Engine 3 — Interface & Access
**Subject:** Web Technologies  |  **Owner:** Member 3
**Project:** Pet Rescue and Animal Welfare Platform (React + Node/Express + MongoDB + Python ML)

One theme · four engines · five subjects · five gates. This zip contains only the files that belong to **Engine 3 — Interface & Access**.
Folder paths are the same as in the full project, so all four engine zips can be extracted into the same folder to rebuild the complete project.

## What this engine does
Owns the **user interface and access control**: the React front end, the Express server entry point, login/registration, JWT protection and role-based permissions.

## Theme coverage
| Theme item | Where it lives here |
|---|---|
| Search and Ranking (UI) | `AnimalSearch.jsx`, `AdoptionGallery.jsx`, `RescueReports.jsx` |
| Ledger / Reporting (UI) | `Dashboard.jsx`, `ModuleViews.jsx` |
| Access | `authRoutes.js`, `authMiddleware.js` (`protect`, `authorize`), `AuthContext.jsx`, role-based sidebar |

## Files
**Server & access (`backend/`)**
- `server.js` – Express app, CORS, JSON parsing, mounts all `/api/*` routes, health check, 404/error handlers
- `routes/authRoutes.js` – register, login (JWT), `/me`
- `routes/userRoutes.js` – admin user directory and role updates
- `middleware/authMiddleware.js` – verifies the Bearer JWT, loads the user, `authorize(...roles)` role check
- `.env.example` – required environment variables (real `.env` intentionally not included)

**Front end (`frontend/`, React 19 + Vite + React Router 7)**
- `src/App.jsx`, `main.jsx`, `index.css`, `App.css`, `styles/dashboard.css`
- `src/context/AuthContext.jsx` – login state and token handling
- `src/pages/` – Home, Login, Register, Dashboard, ReportAnimal, AnimalSearch, AnimalDetails, AnimalManagement, AdoptionLanding, AdoptionGallery, AdoptionApplications, RescueReports, VeterinaryCare, MedicalRecords
- `src/components/` – Navbar, TopNavbar, Sidebar, Footer, ModuleViews, PetModal, AdminAnimalModal, AdoptionFormModal, NoticeModal
- `public/` – images and icons; `vite.config.js`, `package.json`, `index.html`
- `dist/` and `node_modules/` are excluded (rebuild with `npm install` / `npm run build`)

**Project level**
- `package.json` – root scripts (`dev:backend`, `dev:frontend`, …)
- `PROJECT_README.md` – the original full-project README (modules, test accounts, run guide)
- `pet_rescue/` – earlier static HTML/CSS prototype and `SETUP_GUIDE.md`

## How to run
```bash
cd backend && npm install && cp .env.example .env && npm start     # http://localhost:5000
cd ../frontend && npm install && npm run dev                       # http://localhost:5173
```
The back end needs Engines 1 and 2 (models and routes) present to start, and MongoDB running.

## Test accounts (password `admin123`)
admin@petrescue.org · vet@petrescue.org · volunteer@petrescue.org · adopter@petrescue.org · donor@petrescue.org · user@petrescue.org

## Depends on / used by
- Uses the REST API from **Engines 1 and 2**; `authMiddleware.js` is imported by their routes.
- `test-api.js` in **Engine 4** exercises `authRoutes.js`.

## Rebuilding the full project
1. Create an empty folder `miniproject/`.
2. Extract all four engine zips into it (accept overwrite for `backend/package.json`; it is identical in every zip).
3. `cd backend && npm install` and `cd ../frontend && npm install`.
4. Copy `backend/.env.example` to `backend/.env` and set the values.
5. Start MongoDB, then `npm start` in `backend`, then `npm run dev` in `frontend` (http://localhost:5173).
