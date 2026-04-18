const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
  {
    customerName: { type: String, default: "Walk-in Customer" },

    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        title: String,
        price: Number,
        quantity: Number,
        total: Number,
      }
    ],

    subtotal: Number,
    tax: Number,
    totalAmount: Number,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Invoice', invoiceSchema);