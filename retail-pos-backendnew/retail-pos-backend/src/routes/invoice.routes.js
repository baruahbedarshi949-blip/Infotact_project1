const express = require('express');
const router = express.Router();

// ✅ IMPORT CONTROLLERS
const {
  createInvoice,
  getInvoices,
  getInvoiceById,
  downloadInvoicePDF, // ✅ IMPORTANT
} = require('../controllers/invoice.controller');

// ✅ IMPORT AUTH
const { protect } = require('../middlewares/auth.middleware');


// ✅ CREATE INVOICE
router.post('/', protect, createInvoice);

// ✅ GET ALL INVOICES
router.get('/', protect, getInvoices);

// ✅ GET SINGLE INVOICE
router.get('/:id', protect, getInvoiceById);

// ✅ DOWNLOAD PDF (🔥 ADD HERE)
router.get('/:id/pdf', protect, downloadInvoicePDF);


module.exports = router;