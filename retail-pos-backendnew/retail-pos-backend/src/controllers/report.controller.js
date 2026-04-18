const Invoice = require('../models/Invoice');
const InventoryStock = require('../models/InventoryStock');
const asyncHandler = require('../middlewares/asyncHandler');


// ==========================================
// ✅ SALES SUMMARY (WITH FILTER + PAGINATION)
// ==========================================
exports.salesSummary = asyncHandler(async (req, res) => {
  let {
    page = 1,
    limit = 5,
    from,
    to,
    customerName,
    sort = 'desc',
  } = req.query;

  page = Number(page) || 1;
  limit = Number(limit) || 5;

  const filter = {};

  // 📅 Date filter
  if (from && to) {
    filter.createdAt = {
      $gte: new Date(from),
      $lte: new Date(to),
    };
  }

  // 🔍 Customer search
  if (customerName) {
    filter.customerName = {
      $regex: customerName,
      $options: 'i',
    };
  }

  // 🔥 Sorting
  const sortOption = {
    createdAt: sort === 'asc' ? 1 : -1,
  };

  const invoices = await Invoice.find(filter)
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Invoice.countDocuments(filter);

  let totalRevenue = 0;
  let totalItemsSold = 0;

  invoices.forEach((inv) => {
    totalRevenue += inv.totalAmount || 0;

    inv.items.forEach((item) => {
      totalItemsSold += item.quantity || 0;
    });
  });

  res.json({
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    totalRecords: total,

    summary: {
      totalRevenue,
      totalOrders: invoices.length,
      totalItemsSold,
    },

    invoices,
  });
});


// ==========================================
// ✅ INVENTORY VALUATION
// ==========================================
exports.inventoryValuation = asyncHandler(async (req, res) => {
  const items = await InventoryStock.find({})
    .select('storeId sku quantityOnHand costPrice');

  let totalInventoryValue = 0;

  const detailed = items.map(item => {
    const value = (item.costPrice || 0) * (item.quantityOnHand || 0);
    totalInventoryValue += value;

    return {
      storeId: item.storeId,
      sku: item.sku,
      quantity: item.quantityOnHand || 0,
      costPrice: item.costPrice || 0,
      value,
    };
  });

  res.json({
    totalInventoryValue,
    count: detailed.length,
    items: detailed,
  });
});


// ==========================================
// 🔥 TOP SELLING PRODUCTS (WITH LIMIT)
// ==========================================
exports.topSellingProducts = asyncHandler(async (req, res) => {
  const { limit = 5 } = req.query;

  const invoices = await Invoice.find();

  const productMap = {};

  invoices.forEach((inv) => {
    inv.items.forEach((item) => {
      const key = item.productId.toString();

      if (!productMap[key]) {
        productMap[key] = {
          productId: key,
          title: item.title,
          totalSold: 0,
        };
      }

      productMap[key].totalSold += item.quantity || 0;
    });
  });

  const result = Object.values(productMap)
    .sort((a, b) => b.totalSold - a.totalSold)
    .slice(0, Number(limit));

  res.json({
    count: result.length,
    items: result,
  });
});


// ==========================================
// 🚀 DASHBOARD (FILTER + FULL ANALYTICS)
// ==========================================
exports.dashboardReport = asyncHandler(async (req, res) => {
  const { from, to } = req.query;

  const filter = {};

  if (from && to) {
    filter.createdAt = {
      $gte: new Date(from),
      $lte: new Date(to),
    };
  }

  const invoices = await Invoice.find(filter);
  const inventory = await InventoryStock.find();

  // =====================
  // SALES SUMMARY
  // =====================
  let totalRevenue = 0;
  let totalOrders = invoices.length;
  let totalItemsSold = 0;

  invoices.forEach(inv => {
    totalRevenue += inv.totalAmount || 0;

    inv.items.forEach(item => {
      totalItemsSold += item.quantity || 0;
    });
  });

  // =====================
  // TOP PRODUCTS
  // =====================
  const productMap = {};

  invoices.forEach(inv => {
    inv.items.forEach(item => {
      const key = item.productId.toString();

      if (!productMap[key]) {
        productMap[key] = {
          productId: key,
          title: item.title,
          totalSold: 0,
        };
      }

      productMap[key].totalSold += item.quantity || 0;
    });
  });

  const topProducts = Object.values(productMap)
    .sort((a, b) => b.totalSold - a.totalSold)
    .slice(0, 5);

  // =====================
  // DAILY SALES
  // =====================
  const salesMap = {};

  invoices.forEach(inv => {
    const date = new Date(inv.createdAt).toISOString().split('T')[0];

    if (!salesMap[date]) {
      salesMap[date] = 0;
    }

    salesMap[date] += inv.totalAmount || 0;
  });

  const dailySales = Object.keys(salesMap).map(date => ({
    date,
    revenue: salesMap[date],
  }));

  // =====================
  // INVENTORY VALUE
  // =====================
  let totalInventoryValue = 0;

  inventory.forEach(item => {
    totalInventoryValue += (item.costPrice || 0) * (item.quantityOnHand || 0);
  });

  // =====================
  // FINAL RESPONSE
  // =====================
  res.json({
    filtersUsed: { from, to },

    summary: {
      totalRevenue,
      totalOrders,
      totalItemsSold,
    },

    topProducts,
    dailySales,

    inventory: {
      totalInventoryValue,
    },
  });
});