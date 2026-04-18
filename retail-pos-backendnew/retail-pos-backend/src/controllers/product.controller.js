const Product = require('../models/Product');
const asyncHandler = require('../middlewares/asyncHandler');
const ApiError = require('../utils/ApiError');
const { buildCursorFilter } = require('../utils/pagination');
const cache = require('../services/cache.service');


// ✅ LIST PRODUCTS
exports.listProducts = asyncHandler(async (req, res) => {
  const { q = '', limit = 20, cursor, category } = req.query;
  const parsedLimit = Math.min(Number(limit) || 20, 100);
  const cacheKey = `products:${q}:${category || 'all'}:${cursor || 'start'}:${parsedLimit}`;

  const cached = await cache.getJSON(cacheKey);
  if (cached) return res.json(cached);

  const filter = { isActive: true, ...buildCursorFilter(cursor) };
  if (category) filter.category = category;
  if (q) filter.$text = { $search: q };

  const products = await Product.find(filter).sort({ _id: 1 }).limit(parsedLimit + 1);
  let nextCursor = null;
  let items = products;

  if (products.length > parsedLimit) {
    const nextItem = products.pop();
    nextCursor = nextItem._id;
    items = products;
  }

  const payload = {
    items,
    pageInfo: { nextCursor, hasNextPage: Boolean(nextCursor) }
  };

  await cache.setJSON(cacheKey, payload, 60);
  res.json(payload);
});


// ✅ GET PRODUCT BY ID
exports.getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  res.json(product);
});


// 🔥 GET PRODUCT BY BARCODE (NEW)
exports.getProductByBarcode = asyncHandler(async (req, res) => {
  const { code } = req.params;

  if (!code || code.length < 3) {
    throw new ApiError(400, "Invalid barcode");
  }

  const product = await Product.findOne({
    "variants.barcode": code,
    isActive: true
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const variant = product.variants.find(v => v.barcode === code);

  res.json({
    productId: product._id,
    name: product.name,
    variantId: variant._id,
    price: variant.price,
    sku: variant.sku,
    barcode: variant.barcode
  });
});


// ✅ CREATE PRODUCT
exports.createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  await cache.invalidatePattern('products:*');
  res.status(201).json(product);
});


// ✅ UPDATE PRODUCT
exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!product) throw new ApiError(404, 'Product not found');

  await cache.invalidatePattern('products:*');
  res.json(product);
});


// ✅ DELETE (SOFT DELETE)
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!product) throw new ApiError(404, 'Product not found');

  await cache.invalidatePattern('products:*');
  res.json({ message: 'Product archived' });
});
// const Product = require('../models/Product');
// const asyncHandler = require('../middlewares/asyncHandler');
// const ApiError = require('../utils/ApiError');
// const { buildCursorFilter } = require('../utils/pagination');
// const cache = require('../services/cache.service');


// // ✅ LIST PRODUCTS
// exports.listProducts = asyncHandler(async (req, res) => {
//   const { q = '', limit = 20, cursor, category } = req.query;
//   const parsedLimit = Math.min(Number(limit) || 20, 100);
//   const cacheKey = `products:${q}:${category || 'all'}:${cursor || 'start'}:${parsedLimit}`;

//   const cached = await cache.getJSON(cacheKey);
//   if (cached) return res.json(cached);

//   const filter = { isActive: true, ...buildCursorFilter(cursor) };
//   if (category) filter.category = category;
//   if (q) filter.$text = { $search: q };

//   const products = await Product.find(filter).sort({ _id: 1 }).limit(parsedLimit + 1);
//   let nextCursor = null;
//   let items = products;

//   if (products.length > parsedLimit) {
//     const nextItem = products.pop();
//     nextCursor = nextItem._id;
//     items = products;
//   }

//   const payload = { items, pageInfo: { nextCursor, hasNextPage: Boolean(nextCursor) } };
//   await cache.setJSON(cacheKey, payload, 60);
//   res.json(payload);
// });


// // ✅ GET PRODUCT BY ID
// exports.getProductById = asyncHandler(async (req, res) => {
//   const product = await Product.findById(req.params.id);
//   if (!product) throw new ApiError(404, 'Product not found');
//   res.json(product);
// });


// // 🔥 ADD BARCODE FUNCTION RIGHT HERE 👇
// exports.getProductByBarcode = asyncHandler(async (req, res) => {
//   const { code } = req.params;

//   if (!code) {
//     throw new ApiError(400, "Barcode is required");
//   }

//   const product = await Product.findOne({
//     "variants.barcode": code,
//     isActive: true
//   });

//   if (!product) {
//     throw new ApiError(404, "Product not found");
//   }

//   const variant = product.variants.find(v => v.barcode === code);

//   res.json({
//     productId: product._id,
//     name: product.name,
//     variantId: variant._id,
//     price: variant.price,
//     sku: variant.sku,
//     barcode: variant.barcode
//   });
// });


// // ✅ CREATE
// exports.createProduct = asyncHandler(async (req, res) => {
//   const product = await Product.create(req.body);
//   await cache.invalidatePattern('products:*');
//   res.status(201).json(product);
// });


// // ✅ UPDATE
// exports.updateProduct = asyncHandler(async (req, res) => {
//   const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });
//   if (!product) throw new ApiError(404, 'Product not found');
//   await cache.invalidatePattern('products:*');
//   res.json(product);
// });


// // ✅ DELETE
// exports.deleteProduct = asyncHandler(async (req, res) => {
//   const product = await Product.findByIdAndUpdate(
//     req.params.id,
//     { isActive: false },
//     { new: true }
//   );
//   if (!product) throw new ApiError(404, 'Product not found');
//   await cache.invalidatePattern('products:*');
//   res.json({ message: 'Product archived' });
// });
// const Product = require('../models/Product');
// const asyncHandler = require('../middlewares/asyncHandler');
// const ApiError = require('../utils/ApiError');
// const { buildCursorFilter } = require('../utils/pagination');
// const cache = require('../services/cache.service');

// exports.listProducts = asyncHandler(async (req, res) => {
//   const { q = '', limit = 20, cursor, category } = req.query;
//   const parsedLimit = Math.min(Number(limit) || 20, 100);
//   const cacheKey = `products:${q}:${category || 'all'}:${cursor || 'start'}:${parsedLimit}`;

//   const cached = await cache.getJSON(cacheKey);
//   if (cached) return res.json(cached);

//   const filter = { isActive: true, ...buildCursorFilter(cursor) };
//   if (category) filter.category = category;
//   if (q) filter.$text = { $search: q };

//   const products = await Product.find(filter).sort({ _id: 1 }).limit(parsedLimit + 1);
//   let nextCursor = null;
//   let items = products;

//   if (products.length > parsedLimit) {
//     const nextItem = products.pop();
//     nextCursor = nextItem._id;
//     items = products;
//   }

//   const payload = { items, pageInfo: { nextCursor, hasNextPage: Boolean(nextCursor) } };
//   await cache.setJSON(cacheKey, payload, 60);
//   res.json(payload);
// });

// exports.getProductById = asyncHandler(async (req, res) => {
//   const product = await Product.findById(req.params.id);
//   if (!product) throw new ApiError(404, 'Product not found');
//   res.json(product);
// });

// exports.createProduct = asyncHandler(async (req, res) => {
//   const product = await Product.create(req.body);
//   await cache.invalidatePattern('products:*');
//   res.status(201).json(product);
// });

// exports.updateProduct = asyncHandler(async (req, res) => {
//   const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });
//   if (!product) throw new ApiError(404, 'Product not found');
//   await cache.invalidatePattern('products:*');
//   res.json(product);
// });

// exports.deleteProduct = asyncHandler(async (req, res) => {
//   const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
//   if (!product) throw new ApiError(404, 'Product not found');
//   await cache.invalidatePattern('products:*');
//   res.json({ message: 'Product archived' });
// });
