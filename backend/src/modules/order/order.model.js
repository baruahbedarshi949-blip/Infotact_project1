import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  items: [
    {
      productId: String,
      quantity: Number,
    },
  ],
  total: Number,
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);