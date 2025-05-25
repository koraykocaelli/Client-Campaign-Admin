# 🧠 Client-Campaign-Admin

A full-stack admin panel for managing campaigns, clients, and staff, built with a React frontend and Node.js/Express backend. Designed for internal company use, admin dashboards, and CRM-style workflows.

---

## 📦 Tech Stack

### Frontend (Client)
- React.js
- Axios
- CSS Modules

### Backend (API)
- Node.js
- Express
- PostgreSQL (or your preferred DB)
- JWT authentication

---

## 🚀 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/Client-Campaign-Admin.git
cd Client-Campaign-Admin
```

### 2. Install Client dependencies
```bash
cd Client
npm install
```

### 3. Install API dependencies
```bash
cd ../API
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside `/API/` using the provided `.env.example` file as a reference:

```env
PORT=5000
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_secret_key
```

## 🧪 Running the Project

Run API (backend)

```bash
cd API
npm start
```

Run Client (frontend)

```bash
cd ../Client
npm start
```

📬 Features

    🔐 Admin authentication (JWT)

    📊 Campaign management

    👤 Client and staff overview

    💡 React-based responsive interface

    🧩 Modular routes and components

⚠️ Notes

    This project is intended for internal dashboards or as a base template.

    Feel free to customize the models and routes for your use case.    

