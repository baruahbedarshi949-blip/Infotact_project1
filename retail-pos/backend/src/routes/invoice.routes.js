// const express = require('express');
// const router = express.Router();

// const controller = require('../controllers/invoice.controller');
// const { protect } = require('../middlewares/auth.middleware');

// router.get('/:orderId/pdf', protect, controller.downloadInvoicePdf);
// router.get('/:orderId', protect, controller.getInvoiceByOrderId);

// module.exports = router;
const express = require('express');
const router = express.Router();

const {
  downloadInvoicePdf,
  getInvoiceByOrderId,
} = require('../controllers/invoice.controller');

const { protect } = require('../middlewares/auth.middleware');

// Get invoice JSON
router.get('/:orderId', protect, getInvoiceByOrderId);

// Download invoice PDF
router.get('/:orderId/pdf', protect, downloadInvoicePdf);

module.exports = router;