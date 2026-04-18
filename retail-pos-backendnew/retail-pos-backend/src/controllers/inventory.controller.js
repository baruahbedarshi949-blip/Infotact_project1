const InventoryStock = require('../models/InventoryStock');
const InventoryLedger = require('../models/InventoryLedger');
const StockTransfer = require('../models/StockTransfer');
const asyncHandler = require('../middlewares/asyncHandler');

exports.getStock = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.storeId) filter.storeId = req.query.storeId;
  if (req.query.sku) filter.sku = req.query.sku;
  const items = await InventoryStock.find(filter).sort({ updatedAt: -1 });
  res.json({ items });
});

exports.getLowStockItems = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.storeId) filter.storeId = req.query.storeId;
  const items = await InventoryStock.find(filter).sort({ quantityOnHand: 1 });
  const lowStock = items.filter((item) => item.quantityOnHand <= item.reorderPoint);
  res.json({ items: lowStock });
});

exports.getLedger = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.storeId) filter.storeId = req.query.storeId;
  if (req.query.sku) filter.sku = req.query.sku;
  const items = await InventoryLedger.find(filter).sort({ createdAt: -1 }).limit(200);
  res.json({ items });
});

exports.createTransfer = asyncHandler(async (req, res) => {
  const transfer = await StockTransfer.create({ ...req.body, requestedBy: req.user._id });
  res.status(201).json(transfer);
});
