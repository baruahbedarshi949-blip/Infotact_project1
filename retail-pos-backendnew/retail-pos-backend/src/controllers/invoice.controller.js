
const mongoose = require('mongoose'); // ✅ IMPORTANT
const Invoice = require('../models/Invoice');
const Product = require('../models/Product');
const generateInvoicePDF = require('../utils/pdfGenerator');


// ✅ CREATE INVOICE
exports.createInvoice = async (req, res) => {
  try {
    const { items, customerName } = req.body;

    // ✅ Basic validation
    if (!customerName || !items || items.length === 0) {
      return res.status(400).json({
        message: 'customerName and items are required',
      });
    }

    let subtotal = 0;
    const processedItems = [];

    for (let item of items) {

      // ✅ Validate item
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({
          message: 'Each item must have valid productId and quantity',
        });
      }

      // ✅ Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        return res.status(400).json({
          message: `Invalid productId: ${item.productId}`,
        });
      }

      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          message: 'Product not found',
        });
      }

      // ✅ Get price from variants
      const price = product.variants?.[0]?.price;

      if (!price || isNaN(price)) {
        return res.status(400).json({
          message: `Price not found for ${product.title}`,
        });
      }

      // ✅ Check stock
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.title}`,
        });
      }

      const total = price * item.quantity;
      subtotal += total;

      // ✅ Reduce stock
      product.stock -= item.quantity;
      await product.save();

      processedItems.push({
        productId: product._id,
        title: product.title,
        price,
        quantity: item.quantity,
        total,
      });
    }

    const tax = subtotal * 0.05;
    const totalAmount = subtotal + tax;

    const invoice = await Invoice.create({
      customerName,
      items: processedItems,
      subtotal,
      tax,
      totalAmount,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: 'Invoice created successfully',
      invoice,
    });

  } catch (error) {
    console.error('Create Invoice Error:', error);
    res.status(500).json({
      message: error.message,
    });
  }
};



// ✅ GET ALL INVOICES
exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: invoices.length,
      invoices,
    });

  } catch (error) {
    console.error('Get Invoices Error:', error);
    res.status(500).json({
      message: error.message,
    });
  }
};



// ✅ GET SINGLE INVOICE
exports.getInvoiceById = async (req, res) => {
  try {
    const invoiceId = req.params.id;

    // ✅ FIX: Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      return res.status(400).json({
        message: 'Invalid Invoice ID',
      });
    }

    const invoice = await Invoice.findById(invoiceId)
      .populate('createdBy', 'name email');

    if (!invoice) {
      return res.status(404).json({
        message: 'Invoice not found',
      });
    }

    res.status(200).json(invoice);

  } catch (error) {
    console.error('Get Invoice Error:', error);
    res.status(500).json({
      message: error.message,
    });
  }
};



// ✅ DOWNLOAD INVOICE PDF
exports.downloadInvoicePDF = async (req, res) => {
  try {
    const invoiceId = req.params.id;

    // ✅ FIX: Validate ObjectId (VERY IMPORTANT)
    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      return res.status(400).json({
        message: 'Invalid Invoice ID',
      });
    }

    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) {
      return res.status(404).json({
        message: 'Invoice not found',
      });
    }

    // ✅ Generate PDF
    generateInvoicePDF(invoice, res);

  } catch (error) {
    console.error('PDF Error:', error);
    res.status(500).json({
      message: error.message,
    });
  }
};
// const Invoice = require('../models/Invoice');
// const Product = require('../models/Product');
// const generateInvoicePDF = require('../utils/pdfGenerator'); // ✅ ADD THIS


// // ✅ CREATE INVOICE
// exports.createInvoice = async (req, res) => {
//   try {
//     const { items, customerName } = req.body;

//     // ✅ Validation
//     if (!customerName || !items || items.length === 0) {
//       return res.status(400).json({
//         message: 'customerName and items are required',
//       });
//     }

//     let subtotal = 0;
//     const processedItems = [];

//     for (let item of items) {
//       if (!item.productId || !item.quantity) {
//         return res.status(400).json({
//           message: 'Each item must have productId and quantity',
//         });
//       }

//       const product = await Product.findById(item.productId);

//       if (!product) {
//         return res.status(404).json({
//           message: `Product not found`,
//         });
//       }

//       // ✅ GET PRICE FROM VARIANTS
//       const price = product.variants?.[0]?.price;

//       if (!price) {
//         return res.status(400).json({
//           message: `Price not found for ${product.title}`,
//         });
//       }

//       // ✅ CHECK STOCK
//       if (product.stock < item.quantity) {
//         return res.status(400).json({
//           message: `Insufficient stock for ${product.title}`,
//         });
//       }

//       const total = price * item.quantity;
//       subtotal += total;

//       // ✅ REDUCE STOCK
//       product.stock -= item.quantity;
//       await product.save();

//       processedItems.push({
//         productId: product._id,
//         title: product.title,
//         price: price,
//         quantity: item.quantity,
//         total,
//       });
//     }

//     const tax = subtotal * 0.05;
//     const totalAmount = subtotal + tax;

//     const invoice = await Invoice.create({
//       customerName,
//       items: processedItems,
//       subtotal,
//       tax,
//       totalAmount,
//       createdBy: req.user._id,
//     });

//     res.status(201).json({
//       message: 'Invoice created successfully',
//       invoice,
//     });

//   } catch (error) {
//     console.error('Create Invoice Error:', error);
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };



// // ✅ GET ALL INVOICES
// exports.getInvoices = async (req, res) => {
//   try {
//     const invoices = await Invoice.find()
//       .populate('createdBy', 'name email')
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       count: invoices.length,
//       invoices,
//     });

//   } catch (error) {
//     console.error('Get Invoices Error:', error);
//     res.status(500).json({ message: error.message });
//   }
// };



// // ✅ GET SINGLE INVOICE
// exports.getInvoiceById = async (req, res) => {
//   try {
//     const invoice = await Invoice.findById(req.params.id)
//       .populate('createdBy', 'name email');

//     if (!invoice) {
//       return res.status(404).json({
//         message: 'Invoice not found',
//       });
//     }

//     res.status(200).json(invoice);

//   } catch (error) {
//     console.error('Get Invoice Error:', error);
//     res.status(500).json({ message: error.message });
//   }
// };



// // ✅ DOWNLOAD PDF (🔥 NEW FEATURE)
// exports.downloadInvoicePDF = async (req, res) => {
//   try {
//     const invoice = await Invoice.findById(req.params.id);

//     if (!invoice) {
//       return res.status(404).json({
//         message: 'Invoice not found',
//       });
//     }

//     generateInvoicePDF(invoice, res);

//   } catch (error) {
//     console.error('PDF Error:', error);
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };