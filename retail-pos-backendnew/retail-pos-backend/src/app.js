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
app.use(helmet());
app.use(cors());
app.use(express.json());
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
// ✅ API ROUTES (IMPORTANT)
// ==========================
console.log("🔥 LOADING ROUTES...");

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/orders", orderRoutes); // 🔥 CRITICAL
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
// ❌ 404 HANDLER (MUST BE LAST)
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