const express = require("express");
const router = express.Router();

const controller = require("../controllers/product.controller");
const { protect } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/role.middleware");

// ==========================================
// ✅ PUBLIC ROUTES (NO AUTH REQUIRED)
// ==========================================

// 👉 LIST PRODUCTS (IMPORTANT: frontend uses this)
router.get("/", controller.listProducts);

// 👉 GET PRODUCT BY BARCODE (MUST BE BEFORE :id)
router.get("/barcode/:code", controller.getProductByBarcode);

// 👉 GET PRODUCT BY ID
router.get("/:id", controller.getProductById);

// ==========================================
// 🔐 PROTECTED ROUTES (ADMIN)
// ==========================================

// 👉 CREATE PRODUCT
router.post(
  "/",
  protect,
  allowRoles("system_admin", "inventory_manager"),
  controller.createProduct
);

// 👉 UPDATE PRODUCT
router.put(
  "/:id",
  protect,
  allowRoles("system_admin", "inventory_manager"),
  controller.updateProduct
);

// 👉 DELETE PRODUCT
router.delete(
  "/:id",
  protect,
  allowRoles("system_admin"),
  controller.deleteProduct
);

module.exports = router;