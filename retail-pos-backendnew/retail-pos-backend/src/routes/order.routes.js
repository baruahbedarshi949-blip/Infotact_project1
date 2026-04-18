const express = require("express");
const router = express.Router();

const controller = require("../controllers/order.controller");

console.log("🔥 ORDER ROUTES INITIALIZED");

// ================= CREATE ORDER =================
router.post("/", controller.createPOSOrder);

// ================= GET ALL ORDERS =================
router.get("/", controller.listOrders);

// ================= REFUND ORDER =================
router.post("/:id/refund", controller.refundOrder);

// ================= GET ORDER BY ID =================
router.get("/:id", controller.getOrderById);

module.exports = router;