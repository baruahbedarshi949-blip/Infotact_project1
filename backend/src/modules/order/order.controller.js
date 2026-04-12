import Order from "./order.model.js";
import Product from "../product/product.model.js";

export const createOrder = async (req, res) => {
  const { items } = req.body;

  let total = 0;

  for (let item of items) {
    const product = await Product.findById(item.productId);

    if (!product || product.stock < item.quantity) {
      return res.status(400).json({ msg: "Out of stock" });
    }

    product.stock -= item.quantity;
    await product.save();

    total += product.price * item.quantity;
  }

  const order = await Order.create({ items, total });

  res.json(order);
};