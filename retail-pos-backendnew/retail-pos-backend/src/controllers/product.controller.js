const Product = require("../models/Product");

// ==============================
// ✅ LIST PRODUCTS (FINAL FIX)
// ==============================
exports.listProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });

    res.status(200).json({
      items: products,
    });
  } catch (error) {
    console.error("PRODUCT FETCH ERROR:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ==============================
// ✅ GET PRODUCT BY ID
// ==============================
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ==============================
// 🔥 GET PRODUCT BY BARCODE
// ==============================
exports.getProductByBarcode = async (req, res) => {
  try {
    const { code } = req.params;

    const product = await Product.findOne({
      "variants.barcode": code,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const variant = product.variants.find((v) => v.barcode === code);

    res.json({
      productId: product._id,
      title: product.title,
      variantId: variant._id,
      price: variant.price,
      sku: variant.sku,
      barcode: variant.barcode,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ==============================
// ✅ CREATE PRODUCT
// ==============================
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ==============================
// ✅ UPDATE PRODUCT
// ==============================
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ==============================
// ✅ DELETE PRODUCT
// ==============================
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product archived" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};