const Order = require("../models/Order"); // ✅ MUST BE ON TOP
const asyncHandler = require("../middlewares/asyncHandler");
const orderService = require("../services/order.service");

// ================= CREATE ORDER =================
exports.createPOSOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createPOSOrder(req.body, req.user);
  res.status(201).json(order);
});

// ================= REFUND =================
exports.refundOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.status === "refunded") {
    return res.status(400).json({ message: "Already refunded" });
  }

  order.status = "refunded";
  await order.save();

  res.json({
    message: "Refund successful",
    order,
  });
});

// ================= GET ALL =================
exports.listOrders = asyncHandler(async (req, res) => {
  const items = await Order.find()
    .sort({ createdAt: -1 })
    .limit(100);

  res.json({ items });
});

// ================= GET BY ID =================
exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json(order);
});