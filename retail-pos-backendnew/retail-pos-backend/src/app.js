require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const errorHandler = require("./middlewares/error.middleware");
const setupSwagger = require("./docs/swagger");

// ==========================
// ✅ IMPORT ROUTES
// ==========================
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const inventoryRoutes = require("./routes/inventory.routes");
const orderRoutes = require("./routes/order.routes");
const customerRoutes = require("./routes/customer.routes");
const promotionRoutes = require("./routes/promotion.routes");
const taxRoutes = require("./routes/tax.routes");
const storeRoutes = require("./routes/store.routes");
const reportRoutes = require("./routes/report.routes");
const invoiceRoutes = require("./routes/invoice.routes");

const app = express();

// ==========================
// ✅ GLOBAL MIDDLEWARES
// ==========================

// 🔐 Security
app.use(helmet());

// 🔥🔥🔥 FINAL CORS FIX (NO MORE ERRORS)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // allow all origins
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  // ✅ handle preflight request
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// 🧾 Body parser
app.use(express.json());

// 📊 Logger
app.use(morgan("dev"));

// ==========================
// ✅ HEALTH CHECK
// ==========================
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running 🚀",
  });
});

// ==========================
// ✅ API ROUTES
// ==========================
console.log("🔥 LOADING ROUTES...");

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/promotions", promotionRoutes);
app.use("/api/tax-rules", taxRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/invoices", invoiceRoutes);

console.log("✅ ALL ROUTES LOADED");

// ==========================
// ✅ SWAGGER
// ==========================
setupSwagger(app);

// ==========================
// ❌ 404 HANDLER
// ==========================
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// ==========================
// ❌ GLOBAL ERROR HANDLER
// ==========================
app.use(errorHandler);

module.exports = app;