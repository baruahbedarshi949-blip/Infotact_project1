# 🛒 Retail POS System (Full Stack)

🚀 A full-stack **Retail Point of Sale (POS) & Inventory Management System** built using the **MERN Stack (MongoDB, Express, React, Node.js)**.

🔗 **Live Demo:** 
https://infotact-project1-2-0pl0.onrender.com
---

## 📌 Overview

SIgn IN credentials:
gmail : admin@gmail.com
password : 123456

This system simulates a real-world retail environment with:

* Product & inventory management
* POS billing system
* Order processing
* Invoice PDF generation
* Dashboard analytics

---

## ⚙️ Tech Stack

### 🔹 Frontend

* React.js (Vite)
* Tailwind CSS
* Axios
* Recharts

### 🔹 Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* PDFKit (Invoice generation)
* Redis (optional caching)

---

## 🏗️ Project Architecture

```
Retail POS System
│
├── frontend/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/       # UI Components
│   │   ├── pages/            # Pages (Dashboard, POS, Products)
│   │   ├── api/              # API Calls (Axios)
│   │   ├── context/          # State Management
│   │   └── App.jsx
│   └── package.json
│
├── backend/                  # Node.js Backend
│   ├── src/
│   │   ├── controllers/      # Business Logic
│   │   ├── models/           # Mongoose Models
│   │   ├── routes/           # API Routes
│   │   ├── middlewares/      # Auth & Error Handling
│   │   ├── utils/            # Helpers (seed, etc.)
│   │   └── server.js
│   └── package.json
│
└── README.md
```

---

## 🔐 Features

### 🔑 Authentication

* JWT-based login system
* Protected routes

### 📦 Product Management

* Add / Edit / Delete products
* Variants (SKU, size, color, price)
* Category & brand filtering

### 📊 Dashboard

* Revenue tracking
* Sales trends (charts)
* Top products
* Low stock alerts

### 🛒 POS System

* Add to cart
* Real-time billing
* Checkout system
* Order creation

### 📦 Inventory Management

* Stock tracking per store
* Add stock functionality
* SKU-based lookup

### 🧾 Invoice System

* Generate invoice after order
* Download PDF invoice
* Includes product, quantity, total

---

## 🔄 Data Flow

```
POS → Checkout → Order Created → OrderLineItems Saved
        ↓
   Inventory Updated
        ↓
   Invoice Generated (PDF)
        ↓
   Dashboard Updated
```

---

## 🚀 Installation Guide

### 🔧 1. Clone Repository

```bash
git clone https://github.com/baruahbedarshi949-blip/Infotact_project1.git
cd Infotact_project1
```

---

### 🔧 2. Setup Backend

```bash
cd backend
npm install
```

Create `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
```

Run backend:

```bash
npm run dev
```

---

### 🔧 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 API Endpoints (Sample)

| Method | Endpoint              | Description      |
| ------ | --------------------- | ---------------- |
| POST   | /api/auth/login       | Login            |
| GET    | /api/products         | Get products     |
| POST   | /api/orders           | Create order     |
| GET    | /api/invoices/:id/pdf | Download invoice |

---

## 📁 Environment Variables

Create `.env` in backend:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
REDIS_URL=optional
```

---

## 🧪 Testing Flow

1. Add product with variant
2. Add stock
3. Go to POS → create order
4. Download invoice
5. Check dashboard

---

## 🧠 Key Learnings

* Full-stack architecture design
* REST API development
* MongoDB schema design
* Real-world POS workflow
* Authentication & authorization
* PDF generation

---

## 📌 Future Improvements

* GST billing format 🇮🇳
* Email invoice sending
* Multi-store support
* Advanced analytics
* Payment gateway integration

---

## 👨‍💻 Author

**Bedarshi Baruah (Bony)**
📧 [baruahbedarshi949@gmail.com](mailto:baruahbedarshi949@gmail.com)

---

## ⭐ Show Your Support

If you like this project:

👉 Star ⭐ the repository
👉 Fork 🍴 and improve
👉 Share 🚀

---

## 📜 License

This project is for educational purposes.
