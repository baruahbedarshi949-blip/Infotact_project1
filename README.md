
####LIVE WORKING LIKS#####
https://frontend-g7s0.onrender.com/dashboard

# 🛒 Retail POS System (Full Stack)

A full-stack **Retail Point of Sale (POS) System** built using the **MERN Stack**.
This project supports product management, order processing, refunds, authentication, and a modern UI dashboard.

---

# 🚀 Features

## 🔐 Authentication

* Login system (JWT based)
* Protected routes
* Logout functionality

## 🛍️ POS System

* Add products to cart
* Dynamic quantity updates
* Checkout system

## 📦 Product Management

* Create / View products
* Variant-based pricing
* Category support

## 📑 Orders

* Create orders
* View order history
* Refund functionality

## 📊 Dashboard

* Sales overview
* Order tracking

---

# 🏗️ Project Structure

```
inventory/
│
├── frontend888/        # React Frontend (Vite + Tailwind)
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── api/
│   │   └── App.jsx
│
├── retail-pos-backend/ # Node.js Backend (Express + MongoDB)
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
```

---

# ⚙️ Tech Stack

## Frontend

* React (Vite)
* Tailwind CSS
* Axios
* React Router

## Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication

---

# 🧠 Architecture

```
Frontend (React)
   ↓ API Calls (Axios)
Backend (Express)
   ↓
Controllers → Services → Models
   ↓
MongoDB Database
```

---

# 📦 Installation Guide

## 🔹 1. Clone Repository

```
git clone https://github.com/YOUR_USERNAME/retail-pos.git
cd retail-pos
```

---

## 🔹 2. Backend Setup

```
cd retail-pos-backend
npm install
```

### Create `.env`

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=secret123
```

### Run Backend

```
npm start
```

---

## 🔹 3. Frontend Setup

```
cd ../frontend888
npm install
npm run dev
```

---

# 🌐 Application URLs

* Frontend: http://localhost:5173
* Backend: http://localhost:5000

---

# 🔑 Default Login

```
Email: admin@gmail.com
Password: 123456
```

---

# 📡 API Endpoints

## Auth

* POST `/api/auth/login`

## Products

* GET `/api/products`
* POST `/api/products`

## Orders

* POST `/api/orders`
* GET `/api/orders`
* POST `/api/orders/:id/refund`

---

# 🧪 How to Use

1. Login to the system
2. Add products from Products page
3. Go to POS → add to cart
4. Click Checkout
5. View orders in Orders page
6. Perform refund if needed

---

# 🎨 UI Theme

* Light Green Modern Theme 🌿
* Clean dashboard layout
* Responsive design

---

# 🛡️ Security Notes

* JWT-based authentication
* Protected routes
* Token stored in localStorage

---

# 🚀 Future Improvements

* Role-based access control
* Invoice generation (PDF)
* Payment gateway integration
* Advanced analytics dashboard

---

# 💼 Resume Worthy Highlights

* Built full-stack MERN application
* Implemented POS workflow with real-time updates
* Designed RESTful APIs with proper architecture
* Integrated authentication and authorization
* Created responsive UI with Tailwind

---

# 👨‍💻 Author

**Bedarshi Baruah (Bony)**
Full Stack Developer 🚀

---

# ⭐ If you like this project

Give it a ⭐ on GitHub!
