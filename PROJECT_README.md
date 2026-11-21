# Pet Rescue and Animal Welfare Platform
## Complete Full-Stack Platform Documentation (React.js + Node.js + Express.js + Python AI/ML + MongoDB)

A nature-inspired, professional animal welfare platform built with **React.js, Node.js, Express.js, Python AI/ML, and MongoDB**.

---

### 1. Technology Stack (Strict Implementation)

- **Frontend:** React.js 19, Vite, React Router 7, Bootstrap 5, Bootstrap Icons, Lucide Icons, Axios, CSS3 Flexbox/Grid
- **Backend:** Node.js, Express.js (ES Modules, REST APIs), Mongoose 8
- **AI/ML Engine:** Python 3 (Urgency Priority Scoring Algorithm & Adopter Compatibility Matchmaking)
- **Database:** MongoDB (`pet_rescue_db`) via MongoDB Compass
- **Authentication:** bcryptjs password hashing, JWT authorization, protected routes

---

### 2. Ready-to-Use Test Accounts

All accounts use the password: `admin123`

| Name | Role | Email | Password | Access Level |
|---|---|---|---|---|
| **Sneha Kiranagi** | **Admin** | `admin@petrescue.org` | `admin123` | **Full Access to All 14 Modules** |
| Dr. Shalini Vet | Veterinarian | `vet@petrescue.org` | `admin123` | Clinical Triage, Medical Records |
| Vikram Volunteer | Rescue Volunteer | `volunteer@petrescue.org` | `admin123` | Rescue Dispatch, Priority Queue |
| Priya Adopter | Adopter | `adopter@petrescue.org` | `admin123` | Pet Matching, Adoption Applications |
| Anand Donor | Donor | `donor@petrescue.org` | `admin123` | Donations, Ledger, Animal Care |
| Rahul Sharma | General User | `user@petrescue.org` | `admin123` | Stray Reporting, Education Hub |

---

### 3. All 14 Navigation Modules (Sidebar)

1. **Dashboard** (`/dashboard`): Flagship dashboard matching the reference image.
2. **Report an Animal**: Form for reporting distressed Dogs, Cats, and Cows.
3. **Available Animals**: Directory with category filters (Dog, Cat, Cow Gaushala care).
4. **Search Animals**: Keyword search + AI compatibility matchmaker.
5. **Adoption Applications**: Review & verification (cow household adoption prevention rule enforced).
6. **Rescue Management**: 7-stage lifecycle tracking (`Pending` → `Under Review` → `Rescue Assigned` → `Rescued` → `Under Treatment` → `Recovered` → `Closed`).
7. **Rescue Priority Ranking**: Urgent cases ranked with Python AI/ML priority score (0–100).
8. **Veterinary & Medical Records**: Clinical diagnosis, trauma surgery, and rabies vaccine records.
9. **Animal Care Education**: 8 educational welfare guides.
10. **Donations & Expenses**: Real-time financial ledger with doughnut chart.
11. **Reports**: Management Information System (MIS) reports.
12. **User Management**: Admin-only member directory and role management.
13. **My Profile**: Account details, permissions matrix, and password updates.
14. **Logout**: JWT session termination.

---

### 4. Running the Platform Locally

#### 1. MongoDB Server (Port 27017)
```powershell
& "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath "c:\miniproject\data\db" --bind_ip 127.0.0.1
```

#### 2. Backend Server (Port 5000)
```powershell
cd c:\miniproject\backend
npm start
```

#### 3. Frontend Server (Port 5173)
```powershell
cd c:\miniproject\frontend
npm run dev
```

Open your browser and navigate to:
👉 **[http://localhost:5173/dashboard](http://localhost:5173/dashboard)**
