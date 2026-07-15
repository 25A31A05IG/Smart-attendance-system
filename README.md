# 🎓 Smart Attendance Management System

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Styled-38B2AC?logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-blue)

A modern **full-stack Smart Attendance Management System** built using the **MERN Stack**. The application enables teachers and administrators to efficiently manage students, record attendance using multiple methods, generate attendance reports, and visualize attendance analytics through an intuitive dashboard.

---

## 🌐 Live Demo

**Frontend:** https://smart-attendance-system-olive-pi.vercel.app/

**Backend API:**  https://smart-attendance-system-ydti.onrender.com

---

## ✨ Features

### 🔐 Authentication
- Teacher/Admin Registration
- Secure Login using JWT Authentication
- Protected Routes
- User-specific student management

### 👨‍🎓 Student Management
- Add Students
- Delete Students
- Upload Student Face Images
- View Student List
- Search Students

### ✅ Attendance Management
- Manual Attendance
- QR Code Attendance
- Face Recognition Attendance
- Bulk Attendance
- Attendance Statistics

### 📊 Dashboard
- Total Students
- Present Students
- Absent Students
- Attendance Percentage
- Interactive Attendance Graph
- Daily Attendance Details

### 📅 Attendance History
- Date-wise Attendance Records
- Attendance Details Modal
- Attendance Percentage Calculation
- Search by Date

### 📄 Student Reports
- Student Profile
- Attendance Summary
- Complete Attendance History
- Share Attendance Report

### 📚 Working Days Management
- Set Academic Year
- Manage Total Working Days
- View Current Working Days

---

# 🛠️ Tech Stack

## Frontend
- React.js
- Vite
- Tailwind CSS
- Axios
- React Router
- Recharts
- QRCode React

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer
- bcrypt

---

# 📂 Project Structure

```
smart-attendance-system/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/smart-attendance-system.git

cd smart-attendance-system
```

---

## Backend Setup

```bash
cd server

npm install

npm start
```

---

## Frontend Setup

```bash
cd client

npm install

npm run dev
```

---

# ⚙️ Environment Variables

## Backend (.env)

```env
PORT=5000

MONGODB_URI=mongodb_connection_string

JWT_SECRET=secret_key
```

---

## Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

For production:

```env
VITE_API_URL=https://your-render-backend.onrender.com/api
```

---

# 📸 Screenshots

Add screenshots here after deployment.

Example:

- Login Page
- Dashboard
- Student Management
- Attendance Page
- QR Attendance
- Attendance Report

---

# 🔒 Authentication

- JWT Based Authentication
- Password Hashing using bcrypt
- Protected APIs
- User-specific Data Isolation

---

# 📈 Future Enhancements

- Email Notifications
- Attendance Export to PDF
- Attendance Export to Excel
- Student Portal
- Parent Portal
- Mobile Application
- Real-time Notifications
- AI Face Recognition Improvements
- Dark/Light Theme Toggle

---

# 💡 Learning Outcomes

This project demonstrates practical implementation of:

- MERN Stack Development
- REST API Design
- JWT Authentication
- MongoDB Relationships
- File Uploads
- Dashboard Analytics
- QR Code Integration
- Responsive UI Design

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push your branch
5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Ramesh Netheti**

B.Tech Computer Science & Engineering

📧 Email: rameshnetheti2008@gmail.com

🔗 LinkedIn: https://www.linkedin.com/in/25a31a05ig?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app

💻 GitHub: https://github.com/25A31A05IG

---

## ⭐ Support

If you found this project helpful, please consider giving it a **⭐ Star** on GitHub. It helps others discover the project and supports future development.
