
# 🧑‍💼 Employee Management System

A full-stack **Employee Management System (EMS)** built with **React.js, Node.js, Express, and MySQL**, enabling easy management of employee data - including adding, updating, and deleting records through an intuitive web interface.

## 🚀 Features

- 📋 View all employees in a clean tabular format  
- ➕ Add new employee details  
- 🔄 Update existing employee information  
- ❌ Delete employees with a single click  
- 🧭 Navigation between employee list and add form  
- 🖥️ Responsive, minimal UI built with Bootstrap  

## 🖼️ Screenshots

### 📃 Employee List
Displays all employee records with options to **Add, Update** and **Remove**.

<img width="1919" height="1021" alt="image" src="https://github.com/user-attachments/assets/d27f6ebb-4342-46e7-80bd-8c641bd5e89b" />
<img width="1919" height="1022" alt="image" src="https://github.com/user-attachments/assets/934b3725-365c-41bb-a507-283eba5ab35b" />

### ➕ Add Employee
Form for adding a new employee with validation.


<img width="1919" height="1018" alt="image" src="https://github.com/user-attachments/assets/0248936f-c432-4124-a86c-094639be086c" />

## 🛠️ Tech Stack

| Component | Technology Used |
|------------|-----------------|
| **Frontend** | React.js, Bootstrap |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL |
| **Runtime** | Node 18+ |
| **Version Control** | Git & GitHub |

## ⚙️ Installation and Setup

Follow these steps to run the project locally:

### 1️⃣ Clone the repository
```bash
git clone https://github.com/mageshit24/Employee-Management-System.git
cd Employee-Management-System
```

### 2️⃣ Install dependencies

For both frontend and backend:

```bash
cd backend
npm install
```

```bash
cd ../frontend
npm install
```

### 3️⃣ Setup Database

Create a MySQL database (e.g., employee_db)

Update database credentials in the backend configuration file (e.g., db.config.js or .env)

Example:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=employee_db
```

### 4️⃣ Run the backend server
```bash
cd backend
npm start
```
Server will run on http://localhost:8080
### 5️⃣ Run the frontend
```bash
cd frontend
npm start
```
Frontend will run on http://localhost:3000
### 🎯 Future Enhancements
- 🔒 User authentication for admin panel
- 🧠 Role-based access control
- 📊 Analytics dashboard for employee insights
- ☁️ Cloud deployment (e.g., Render / Vercel)
