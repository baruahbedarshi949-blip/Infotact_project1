console.log("REPORT ROUTES LOADED 🚀");
const express = require('express');
const router = express.Router();

const {
  salesSummary,
  inventoryValuation,
  topSellingProducts,
  dashboardReport,
} = require('../controllers/report.controller');

const { protect } = require('../middlewares/auth.middleware');
const { allowRoles } = require('../middlewares/role.middleware');


// ==========================
// 📊 SALES SUMMARY
// ==========================
router.get(
  '/sales',
  protect,
  allowRoles('system_admin'),
  salesSummary
);


// ==========================
// 📦 INVENTORY REPORT
// ==========================
router.get(
  '/inventory',
  protect,
  allowRoles('system_admin', 'inventory_manager'),
  inventoryValuation
);


// ==========================
// 🔥 TOP SELLING PRODUCTS
// ==========================
router.get(
  '/top-products',
  protect,
  allowRoles('system_admin'),
  topSellingProducts
);


// ==========================
// 🚀 DASHBOARD (ALL-IN-ONE)
// ==========================
router.get(
  '/dashboard',
  protect,
  allowRoles('system_admin'),
  dashboardReport
);


module.exports = router;