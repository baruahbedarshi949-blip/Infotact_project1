const mongoose = require('mongoose');

console.log("🔥 NEW ORDER MODEL LOADED");

const paymentSchema = new mongoose.Schema(
  {
    method: {
      type: String,
      enum: ['cash', 'credit', 'wallet'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    reference: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    channel: {
      type: String,
      enum: ['pos', 'online'],
      required: true,
    },

    // ✅ NOT REQUIRED ANYMORE
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      default: null,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      default: null,
    },

    // ✅ NOT REQUIRED ANYMORE
    cashierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    status: {
      type: String,
      enum: ['completed', 'refunded', 'partially_refunded'],
      default: 'completed',
    },

    subtotal: {
      type: Number,
      required: true,
    },

    discountTotal: {
      type: Number,
      default: 0,
    },

    taxTotal: {
      type: Number,
      default: 0,
    },

    grandTotal: {
      type: Number,
      required: true,
    },

    promotionCode: {
      type: String,
      default: '',
    },

    payments: [paymentSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);