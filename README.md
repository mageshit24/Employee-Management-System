# 🧑‍💼 Employee Management System

A full-stack **Employee Management System (EMS)** built with **React, Spring Boot, and MySQL**, providing a clean web interface to create, view, update, and delete employee records through a REST API.

---

## ✨ Features

- 📋 View all employees in a clean tabular format
- ➕ Add new employee details
- 🔄 Update existing employee information
- ❌ Delete employees with a single click
- 🧭 Navigation between employee list and add/edit form
- 🖥️ Responsive, minimal UI built with React + Bootstrap
- 🔗 RESTful API backend with full CRUD endpoints

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, React Router, Axios, Bootstrap 5 |
| **Backend** | Java, Spring Boot, Spring Data JPA, Lombok |
| **Database** | MySQL |
| **Build Tools** | Maven (backend), npm/Vite (frontend) |
| **Architecture** | REST API (Controller → Service → Repository → Entity) |

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
│   │   ├── dto/                       # EmployeeDto
│   │   ├── mapper/                    # EmployeeMapper
│   │   └── exception/                 # ResourceNotFoundException
│   ├── src/main/resources/
│   │   └── application.properties     # DB connection config
│   └── pom.xml
└── frontend/                          # React + Vite SPA
    └── src/
        ├── component/                 # HeaderComponent, FooterComponent,
        │                               #  EmployeeComponent, ListEmployeeComponent
        ├── services/
        │   └── EmployeeService.js     # Axios calls to the backend API
        └── App.jsx
```

---

## 🔗 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/employees` | Create a new employee |
| `GET` | `/api/employees` | Get all employees |
| `GET` | `/api/employees/{id}` | Get a single employee by ID |
| `PUT` | `/api/employees/{id}` | Update an employee by ID |
| `DELETE` | `/api/employees/{id}` | Delete an employee by ID |

---

## ⚙️ Installation and Setup

### Prerequisites
- Java 17+ and Maven
- Node.js 18+
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
Add `backend/src/main/resources/application.properties` with your own local credentials:
```properties
spring.application.name=backend

spring.datasource.url=your_connection_url
spring.datasource.username=your_db_user
spring.datasource.password=your_db_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

```
> ⚠️ Keep real credentials out of version control — see the note below.

### 4️⃣ Run the backend (Spring Boot, Maven)
```bash
cd backend
./mvnw spring-boot:run
```
The API will start on **http://localhost:8080**.

### 5️⃣ Run the frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
The app will start on **http://localhost:5173** (Vite's default dev port).

---

## 📸 Screenshots

### 📃 Employee List
Displays all employee records with options to **Add, Update**, and **Remove**.

<img width="1919" height="1021" alt="Employee List view" src="https://github.com/user-attachments/assets/d27f6ebb-4342-46e7-80bd-8c641bd5e89b" />

<img width="1919" height="1022" alt="Employee List view with actions" src="https://github.com/user-attachments/assets/934b3725-365c-41bb-a507-283eba5ab35b" />

### ➕ Add Employee
Form for adding a new employee.

<img width="1919" height="1018" alt="Add Employee form" src="https://github.com/user-attachments/assets/0248936f-c432-4124-a86c-094639be086c" />

---

## 🎯 Future Enhancements

- 🔒 User authentication for admin panel
- 🧠 Role-based access control
- 📊 Analytics dashboard for employee insights
- ☁️ Cloud deployment (e.g., Render / Vercel)
- 🌱 Externalize DB credentials via environment variables / Spring profiles

---

## 👤 Contact

**Magesh Hariram K**
🔗 [LinkedIn](https://www.linkedin.com/in/magesh-hariram-k-6011132a4)
💻 [GitHub](https://github.com/mageshit24)

---

## 📄 License

This project is open source — feel free to use, modify, and build on it. Consider adding a `LICENSE` file (e.g. MIT) to make the terms explicit.
