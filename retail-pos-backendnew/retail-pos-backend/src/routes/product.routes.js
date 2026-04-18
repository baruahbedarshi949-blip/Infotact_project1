const express = require("express");
const router = express.Router();

const controller = require("../controllers/product.controller");
const { protect } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/role.middleware");

// ==========================================
// ✅ PUBLIC ROUTES (NO AUTH REQUIRED)
// ==========================================

// 👉 LIST PRODUCTS (for frontend POS)
router.get("/", controller.listProducts);

// 👉 GET PRODUCT BY BARCODE
router.get("/barcode/:code", controller.getProductByBarcode);

// 👉 GET PRODUCT BY ID
router.get("/:id", controller.getProductById);

// ==========================================
// 🔐 PROTECTED ROUTES (ADMIN ONLY)
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

// const express = require('express');
// const router = express.Router();

// const controller = require('../controllers/product.controller');
// const { protect } = require('../middlewares/auth.middleware');
// const { allowRoles } = require('../middlewares/role.middleware');


// // ✅ LIST PRODUCTS
// router.get('/', protect, controller.listProducts);


// // 🔥 BARCODE ROUTE (IMPORTANT: MUST BE BEFORE :id)
// router.get('/barcode/:code', protect, controller.getProductByBarcode);


// // ✅ GET PRODUCT BY ID
// router.get('/:id', protect, controller.getProductById);


// // ✅ CREATE PRODUCT
// router.post(
//   '/',
//   protect,
//   allowRoles('system_admin', 'inventory_manager'),
//   controller.createProduct
// );


// // ✅ UPDATE PRODUCT
// router.put(
//   '/:id',
//   protect,
//   allowRoles('system_admin', 'inventory_manager'),
//   controller.updateProduct
// );


// // ✅ DELETE PRODUCT (SOFT DELETE)
// router.delete(
//   '/:id',
//   protect,
//   allowRoles('system_admin'),
//   controller.deleteProduct
// );


// module.exports = router;

// const express = require('express');
// const router = express.Router();
// const controller = require('../controllers/product.controller');
// const { protect } = require('../middlewares/auth.middleware');
// const { allowRoles } = require('../middlewares/role.middleware');

// //  LIST PRODUCTS
// router.get('/', protect, controller.listProducts);

// //  ADD BARCODE ROUTE HERE (BEFORE :id)
// router.get('/barcode/:code', protect, controller.getProductByBarcode);

// //  GET BY ID
// router.get('/:id', protect, controller.getProductById);

// //  CREATE
// router.post(
//   '/',
//   protect,
//   allowRoles('system_admin', 'inventory_manager'),
//   controller.createProduct
// );

// //  UPDATE
// router.put(
//   '/:id',
//   protect,
//   allowRoles('system_admin', 'inventory_manager'),
//   controller.updateProduct
// );

// //  DELETE
// router.delete(
//   '/:id',
//   protect,
//   allowRoles('system_admin'),
//   controller.deleteProduct
// );

// module.exports = router;
// const express = require('express');
// const router = express.Router();
// const controller = require('../controllers/product.controller');
// const { protect } = require('../middlewares/auth.middleware');
// const { allowRoles } = require('../middlewares/role.middleware');

// router.get('/', protect, controller.listProducts);
// router.get('/:id', protect, controller.getProductById);
// router.post('/', protect, allowRoles('system_admin', 'inventory_manager'), controller.createProduct);
// router.put('/:id', protect, allowRoles('system_admin', 'inventory_manager'), controller.updateProduct);
// router.delete('/:id', protect, allowRoles('system_admin'), controller.deleteProduct);

// module.exports = router;
