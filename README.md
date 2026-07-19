# 🧑‍💼 Employee Management System

A full-stack **Employee Management System (EMS)** built with **React 19, Spring Boot 3, and MySQL**, providing a records-office-styled web interface to create, view, update, and delete employee records through a REST API — with CORS locked down, no stack traces or SQL leaking to the client, and a browser-DevTools deterrent you can toggle per environment.

---

## ✨ Features

- 📋 Roster view of all employees as record cards (name, email, ID badge)
- 🔎 Live search across name and email, and a sort control (name/email A–Z or Z–A, newest/oldest first) — both handled server-side via `GET /api/employees?q=&sortBy=&sortDir=`
- 📊 Small stats strip (total on file / matching the current search)
- ➕ Add new employee details, with client- and server-side validation
- 🔄 Update existing employee information
- ❌ Delete employees with a confirm-before-you-remove dialog
- 🔔 Toast notifications confirming saves, updates, deletes, and copy actions
- 📋 Copy-email button on each record
- ⏳ Skeleton loading cards instead of a bare "Loading…" message
- 🌗 Light/dark theme toggle, persisted per browser
- 🧭 Navigation between employee list and add/edit form
- 🖥️ Custom "records office" design system (Playfair Display + DM Sans, gold + forest-teal palette; own CSS, no UI framework)
- 🔗 RESTful API backend with full CRUD + search/sort endpoints
- 🔐 Hardened by default — see [Security & Hardening](#-security--hardening) below

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 8 (Rolldown/Oxc), React Router, Axios |
| **Backend** | Java 25, Spring Boot 3.5.16, Spring Data JPA, Lombok |
| **Database** | MySQL |
| **Build Tools** | Maven (backend), npm/Vite (frontend) |
| **Architecture** | REST API (Controller → Service → Repository → Entity), DTO + mapper layer, central exception handler |

---

## 🏗️ Project Structure

```
Employee-Management-System/
├── backend/                          # Spring Boot REST API
│   ├── src/main/java/magesh/ems/backend/
│   │   ├── controller/                # EmployeeController (REST endpoints)
│   │   ├── service/                   # EmployeeService + Impl (business logic)
│   │   ├── repository/                # EmployeeRepository (Spring Data JPA)
│   │   ├── entity/                    # Employee (JPA entity)
│   │   ├── dto/                       # EmployeeDto (bean-validated)
│   │   ├── mapper/                    # EmployeeMapper
│   │   ├── exception/                 # ResourceNotFoundException, GlobalExceptionHandler
│   │   └── config/                    # WebConfig (CORS allow-list), SecurityHeadersFilter
│   ├── src/main/resources/
│   │   ├── application.properties     # DB connection + hardening config, all env-driven
│   │   └── application-dev.properties # Opt-in dev profile: verbose logging, DevTools
│   └── pom.xml
└── frontend/                          # React + Vite SPA
    ├── .env.example                   # VITE_API_BASE_URL, VITE_DISABLE_DEVTOOLS
    └── src/
        ├── component/                 # HeaderComponent, FooterComponent,
        │                               #  EmployeeComponent, ListEmployeeComponent
        ├── services/
        │   └── EmployeeService.js     # Axios calls to the backend API
        ├── utils/
        │   ├── logger.js              # No-op-in-prod console wrapper
        │   ├── devToolsGuard.js       # Deterrent-only DevTools guard (toggle-driven)
        │   ├── useTheme.js            # Light/dark theme toggle (localStorage-backed)
        │   ├── toastContext.js        # Shared React Context object for toasts
        │   ├── ToastProvider.jsx      # Toast stack + auto-dismiss logic
        │   └── useToast.js            # Hook used by any screen to fire a toast
        └── App.jsx
```

---

## 🔐 Security & Hardening

| Area | Before | Now |
|---|---|---|
| CORS | `@CrossOrigin("*")` — any site could call the API | Explicit allow-list via `app.cors.allowed-origins`, configured in `WebConfig` |
| Error responses | Raw exception messages / stack traces reachable | `GlobalExceptionHandler` + `server.error.*` properties return only safe, generic JSON |
| DB credentials | Hardcoded in `application.properties` | Read from `DB_URL` / `DB_USERNAME` / `DB_PASSWORD` env vars, with local-only fallbacks |
| Response headers | None | `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Content-Security-Policy`, `Cache-Control: no-store` on every API response |
| Frontend console | Employee data and Axios errors logged raw | `src/utils/logger.js` is a no-op outside dev builds |
| Production bundle | Default Vite build | Source maps disabled, `console`/`debugger` stripped at build time (see `vite.config.js`) |
| Backend dev tooling | N/A | `spring-boot-devtools` is an `optional` Maven dependency, excluded from the packaged jar (see `pom.xml`), and self-disables when run from a repackaged jar rather than an exploded classpath — it never reaches a deployed build |
| Input validation | None beyond DB constraints | Bean Validation (`@NotBlank`, `@Email`, `@Size`) on the DTO, mirrored in the React form |
| DevTools | N/A | Optional deterrent guard, single env-var toggle — see below |

**DevTools guard.** `VITE_DISABLE_DEVTOOLS=true` in `frontend/.env` blocks the F12 / Ctrl+Shift+I / right-click shortcuts and shows an overlay while a docked DevTools panel looks open. This is friction for casual users on a public demo, **not real security** — anyone who wants to read the JS bundle or inspect network calls still can. There are no secrets in the frontend to protect; the real "code exposure prevention" is the backend never sending stack traces or SQL to the client (see the table above). Leave the flag `false` for local development.

---

## 🔗 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/employees` | Create a new employee |
| `GET` | `/api/employees` | Get all employees. Optional query params: `q` (search first/last name or email), `sortBy` (`firstname` \| `lastname` \| `email` \| `id`), `sortDir` (`asc` \| `desc`) |
| `GET` | `/api/employees/{id}` | Get a single employee by ID |
| `PUT` | `/api/employees/{id}` | Update an employee by ID |
| `DELETE` | `/api/employees/{id}` | Delete an employee by ID |

---

## ⚙️ Installation and Setup

### Prerequisites
- Java 25 and Maven (the bundled `./mvnw` wrapper works too)
- Node.js 20.19+ or 22.12+ (Vite 8's minimum — anything modern like Node 22/24 LTS is fine)
- MySQL Server

### 1️⃣ Clone the repository
```bash
git clone https://github.com/mageshit24/Employee-Management-System.git
cd Employee-Management-System
```

### 2️⃣ Set up the database
Create a MySQL database:
```sql
CREATE DATABASE ems;
```

### 3️⃣ Configure the backend
Credentials are read from environment variables — nothing to hardcode or accidentally commit. Set them before starting the app:
```bash
export DB_URL=jdbc:mysql://localhost:3306/ems
export DB_USERNAME=your_db_user
export DB_PASSWORD=your_db_password
```
Without these set, the app falls back to `jdbc:mysql://localhost:3306/ems` / `root` / empty password for local convenience — fine for a laptop, not for anything shared. See `backend/src/main/resources/application.properties` for the full list of tunables (connection pool size, CORS origins, etc.).

### 4️⃣ Run the backend (Spring Boot, Maven)
```bash
cd backend
./mvnw spring-boot:run
```
The API will start on **http://localhost:8080**.

> **Development mode.** Add `-Dspring-boot.run.profiles=dev` to that command
> (`./mvnw spring-boot:run -Dspring-boot.run.profiles=dev` on Mac/Linux,
> `mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev` on Windows) to
> layer on `application-dev.properties`: formatted SQL logging, DEBUG-level
> app/HTTP logs, and full validation error detail in responses. It also
> pulls in [Spring Boot DevTools](https://docs.spring.io/spring-boot/reference/using/devtools.html)
> (already on the classpath as a dev-only dependency — see `pom.xml`), which
> auto-restarts the app when you rebuild a class and enables LiveReload.
> None of this is active by default, and none of it ships in the packaged
> jar.

### 5️⃣ Run the frontend (React + Vite)
```bash
cd frontend
cp .env.example .env   # then edit VITE_API_BASE_URL / VITE_DISABLE_DEVTOOLS if needed
npm install
npm run dev
```
The app will start on **http://localhost:5173** (Vite's default dev port).

---

## 📸 Screenshots

### 📃 Employee List
Displays all employee records with options to **Add, Update**, and **Remove**.

<img width="1919" height="1022" alt="image" src="https://github.com/user-attachments/assets/0dbd7e32-dd3f-4dbe-80b3-7742f0427503" />

### ➕ Add Employee
Form for adding a new employee.

<img width="1919" height="1022" alt="image" src="https://github.com/user-attachments/assets/d906a734-0115-4e25-aef7-89fdd672180b" />

---

## 🎯 Future Enhancements

- 🔒 User authentication for admin panel (currently the API has no auth layer at all — see the [Security & Hardening](#-security--hardening) note, which is defence-in-depth, not access control)
- 🧠 Role-based access control
- 📊 Analytics dashboard for employee insights
- ☁️ Cloud deployment (e.g., Render / Vercel), with `CORS_ALLOWED_ORIGINS` pinned to the real frontend URL
- 🔎 Server-side pagination once the roster grows past a page or two (search/sort already ship server-side today)

---

## 👤 Contact

**Magesh Hariram K**
🔗 [LinkedIn](https://www.linkedin.com/in/magesh-hariram-k-6011132a4)
💻 [GitHub](https://github.com/mageshit24)

---

## 📄 License

This project is open source — feel free to use, modify, and build on it. Consider adding a `LICENSE` file (e.g. MIT) to make the terms explicit.
