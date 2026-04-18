const mongoose = require("mongoose");
const Order = require("../models/Order");
const OrderLineItem = require("../models/OrderLineItem");
const Product = require("../models/Product");
const ApiError = require("../utils/ApiError");

console.log("✅ FINAL ORDER SERVICE RUNNING");

function generateOrderNumber() {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

async function createPOSOrder(payload, user = { _id: null }) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { items } = payload;

    if (!items || items.length === 0) {
      throw new ApiError(400, "Cart is empty");
    }

    let subtotal = 0;
    const lineItemsToCreate = [];

    for (const item of items) {
      console.log("🔥 FULL ITEM:", item);

      const productId = item.productId;
      const quantity = item.quantity || 1;

      console.log("👉 productId:", productId);

      // ✅ VALIDATE PRODUCT ID
      if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
        throw new ApiError(400, "Invalid productId");
      }

      // ✅ FETCH PRODUCT
      const product = await Product.findById(productId).session(session);

      console.log("🧾 FOUND PRODUCT:", product);

      if (!product) {
        throw new ApiError(404, "Product not found");
      }

      // ✅ ENSURE VARIANT EXISTS
      const variant = product?.variants?.[0];

      if (!variant || !variant._id) {
        throw new ApiError(400, "Variant not found");
      }

      // ✅ PRICE
      const price = variant.price || product.price || 0;

      const lineSubtotal = price * quantity;
      subtotal += lineSubtotal;

      // ✅ FINAL LINE ITEM (FIXED)
      lineItemsToCreate.push({
        productId,
        variantId: variant._id, // 🔥 CRITICAL FIX
        sku: variant.sku || "",
        title: product.title,
        quantity,
        unitPrice: price,
      });
    }

    const tax = subtotal * 0.18;
    const grandTotal = subtotal + tax;

    // ✅ CREATE ORDER
    const order = await Order.create(
      [
        {
          orderNumber: generateOrderNumber(),
          channel: "pos",
          storeId: null,
          cashierId: user?._id || null,
          subtotal,
          discountTotal: 0,
          taxTotal: tax,
          grandTotal,
          payments: [
            {
              method: "cash",
              amount: grandTotal,
            },
          ],
        },
      ],
      { session }
    );

    const orderId = order[0]._id;

    // ✅ CREATE LINE ITEMS
    for (const line of lineItemsToCreate) {
      await OrderLineItem.create(
        [
          {
            ...line,
            orderId,
            lineTotal: line.unitPrice * line.quantity,
          },
        ],
        { session }
      );
    }

    await session.commitTransaction();

    console.log("✅ ORDER CREATED SUCCESSFULLY:", order[0]);

    return order[0];
  } catch (error) {
    console.error("❌ ORDER ERROR:", error.message);

    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

module.exports = { createPOSOrder };
// const mongoose = require('mongoose');
// const Order = require('../models/Order');
// const OrderLineItem = require('../models/OrderLineItem');
// const Product = require('../models/Product');

// const Promotion = require('../models/Promotion');
// const TaxRule = require('../models/TaxRule');
// const ApiError = require('../utils/ApiError');

// // 🔥 Debug log (to confirm new file is running)
// console.log("✅ NEW ORDER SERVICE RUNNING");

// function generateOrderNumber() {
//   return `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
// }

// async function calculatePromotion(code, subtotal, storeId) {
//   if (!code) return { discount: 0, promotionCode: '' };

//   const promo = await Promotion.findOne({
//     code: code.toUpperCase(),
//     active: true,
//     startsAt: { $lte: new Date() },
//     endsAt: { $gte: new Date() },
//     $or: [
//       { applicableStoreIds: { $size: 0 } },
//       { applicableStoreIds: storeId }
//     ],
//   });

//   if (!promo || subtotal < promo.minCartValue) {
//     return { discount: 0, promotionCode: '' };
//   }

//   let discount =
//     promo.type === 'flat'
//       ? promo.value
//       : (subtotal * promo.value) / 100;

//   if (promo.maxDiscount !== null) {
//     discount = Math.min(discount, promo.maxDiscount);
//   }

//   return { discount, promotionCode: promo.code };
// }

// async function calculateTax(storeId, taxableAmount) {
//   const rule = await TaxRule.findOne({ storeId, active: true })
//     .sort({ createdAt: -1 });

//   if (!rule) return 0;

//   return (taxableAmount * rule.rate) / 100;
// }

// async function createPOSOrder(payload, user) {
//   const session = await mongoose.startSession();

//   try {
//     session.startTransaction();

//     const {
//       storeId,
//       customerId = null,
//       items,
//       paymentMethod,
//       promotionCode,
//     } = payload;

//     // 🔴 Validate storeId
//     if (!mongoose.Types.ObjectId.isValid(storeId)) {
//       throw new ApiError(400, 'Invalid storeId');
//     }

//     if (!Array.isArray(items) || items.length === 0) {
//       throw new ApiError(400, 'Order must contain at least one item');
//     }

//     let subtotal = 0;
//     const lineItemsToCreate = [];

//     for (const item of items) {
//       const { productId, variantId, quantity } = item;

//       // 🔴 Validate IDs
//       if (!mongoose.Types.ObjectId.isValid(productId)) {
//         throw new ApiError(400, 'Invalid productId');
//       }

//       if (!mongoose.Types.ObjectId.isValid(variantId)) {
//         throw new ApiError(400, 'Invalid variantId');
//       }

//       if (!quantity || quantity < 1) {
//         throw new ApiError(400, 'Quantity must be at least 1');
//       }

//       const product = await Product.findById(productId).session(session);
//       if (!product) throw new ApiError(404, 'Product not found');

//       const variant = product.variants.id(variantId);
//       if (!variant || !variant.isActive) {
//         throw new ApiError(404, 'Variant not found');
//       }

//       const lineSubtotal = variant.price * quantity;
//       subtotal += lineSubtotal;

//       lineItemsToCreate.push({
//         productId,
//         variantId,
//         sku: variant.sku,
//         title: product.title,
//         variantLabel: `${variant.size || ''} ${variant.color || ''}`.trim(),
//         quantity,
//         unitPrice: variant.price,
//       });
//     }

//     // 🔥 Promotion + Tax
//     const { discount, promotionCode: appliedCode } =
//       await calculatePromotion(promotionCode, subtotal, storeId);

//     const taxableAmount = Math.max(subtotal - discount, 0);
//     const taxTotal = await calculateTax(storeId, taxableAmount);
//     const grandTotal = taxableAmount + taxTotal;

//     // 🔥 Create Order
//     const order = await Order.create(
//       [
//         {
//           orderNumber: generateOrderNumber(),
//           channel: 'pos',
//           storeId,
//           customerId,
//           cashierId: user._id,
//           subtotal,
//           discountTotal: discount,
//           taxTotal,
//           grandTotal,
//           promotionCode: appliedCode,
//           payments: [
//             {
//               method: paymentMethod || 'cash',
//               amount: grandTotal,
//             },
//           ],
//         },
//       ],
//       { session }
//     );

//     const orderId = order[0]._id;

//     // 🔥 Create Line Items
//     for (const line of lineItemsToCreate) {
//       await OrderLineItem.create(
//         [
//           {
//             ...line,
//             orderId,
//             lineTotal: line.unitPrice * line.quantity,
//           },
//         ],
//         { session }
//       );
//     }

//     await session.commitTransaction();

//     return order[0];

//   } catch (error) {
//     await session.abortTransaction();
//     throw error;
//   } finally {
//     session.endSession();
//   }
// }

// module.exports = { createPOSOrder };


// // const mongoose = require('mongoose');
// // const Order = require('../models/Order');
// // const OrderLineItem = require('../models/OrderLineItem');
// // const Product = require('../models/Product');
// // const InventoryStock = require('../models/InventoryStock');
// // const InventoryLedger = require('../models/InventoryLedger');
// // const Promotion = require('../models/Promotion');
// // const TaxRule = require('../models/TaxRule');
// // const ApiError = require('../utils/ApiError');

// // function generateOrderNumber() {
// //   return `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
// // }

// // async function calculatePromotion(code, subtotal, storeId) {
// //   if (!code) return { discount: 0, promotionCode: '' };

// //   const promo = await Promotion.findOne({
// //     code: code.toUpperCase(),
// //     active: true,
// //     startsAt: { $lte: new Date() },
// //     endsAt: { $gte: new Date() },
// //     $or: [{ applicableStoreIds: { $size: 0 } }, { applicableStoreIds: storeId }],
// //   });

// //   if (!promo || subtotal < promo.minCartValue) {
// //     return { discount: 0, promotionCode: '' };
// //   }

// //   let discount = promo.type === 'flat' ? promo.value : (subtotal * promo.value) / 100;
// //   if (promo.maxDiscount !== null) discount = Math.min(discount, promo.maxDiscount);
// //   return { discount, promotionCode: promo.code };
// // }

// // async function calculateTax(storeId, taxableAmount) {
// //   const rule = await TaxRule.findOne({ storeId, active: true }).sort({ createdAt: -1 });
// //   if (!rule) return 0;
// //   return (taxableAmount * rule.rate) / 100;
// // }

// // async function createPOSOrder(payload, user) {
// //   const session = await mongoose.startSession();

// //   try {
// //     session.startTransaction();

// //     const { storeId, customerId = null, items, paymentMethod, promotionCode } = payload;
// //     if (!Array.isArray(items) || !items.length) {
// //       throw new ApiError(400, 'Order must contain at least one item');
// //     }

// //     let subtotal = 0;
// //     const lineItemsToCreate = [];

// //     for (const item of items) {
// //       const { productId, variantId, quantity } = item;
// //       if (!quantity || quantity < 1) throw new ApiError(400, 'Quantity must be at least 1');

// //       const product = await Product.findById(productId).session(session);
// //       if (!product) throw new ApiError(404, 'Product not found');

// //       const variant = product.variants.id(variantId);
// //       if (!variant || !variant.isActive) throw new ApiError(404, 'Variant not found');

// //       const stock = await InventoryStock.findOne({ storeId, productId, variantId }).session(session);
// //       if (!stock) throw new ApiError(404, `No stock record for SKU ${variant.sku}`);
// //       if (stock.quantityOnHand < quantity) throw new ApiError(400, `Insufficient stock for SKU ${variant.sku}`);

// //       const lineSubtotal = variant.price * quantity;
// //       subtotal += lineSubtotal;

// //       lineItemsToCreate.push({
// //         productId,
// //         variantId,
// //         sku: variant.sku,
// //         title: product.title,
// //         variantLabel: `${variant.size || ''} ${variant.color || ''}`.trim(),
// //         quantity,
// //         unitPrice: variant.price,
// //       });
// //     }

// //     const { discount, promotionCode: appliedCode } = await calculatePromotion(promotionCode, subtotal, storeId);
// //     const taxableAmount = Math.max(subtotal - discount, 0);
// //     const taxTotal = await calculateTax(storeId, taxableAmount);
// //     const grandTotal = taxableAmount + taxTotal;

// //     const order = await Order.create(
// //       [{
// //         orderNumber: generateOrderNumber(),
// //         channel: 'pos',
// //         storeId,
// //         customerId,
// //         cashierId: user._id,
// //         subtotal,
// //         discountTotal: discount,
// //         taxTotal,
// //         grandTotal,
// //         promotionCode: appliedCode,
// //         payments: [{ method: paymentMethod || 'cash', amount: grandTotal }],
// //       }],
// //       { session }
// //     );

// //     const orderId = order[0]._id;

// //     for (const line of lineItemsToCreate) {
// //       const stock = await InventoryStock.findOne({
// //         storeId,
// //         productId: line.productId,
// //         variantId: line.variantId,
// //       }).session(session);

// //       const beforeQty = stock.quantityOnHand;
// //       const afterQty = beforeQty - line.quantity;
// //       stock.quantityOnHand = afterQty;
// //       await stock.save({ session });

// //       await OrderLineItem.create([{ ...line, orderId, lineTotal: line.unitPrice * line.quantity }], { session });
// //       await InventoryLedger.create([{
// //         storeId,
// //         productId: line.productId,
// //         variantId: line.variantId,
// //         sku: line.sku,
// //         type: 'sale',
// //         quantityChange: -line.quantity,
// //         beforeQty,
// //         afterQty,
// //         referenceType: 'order',
// //         referenceId: orderId,
// //         createdBy: user._id,
// //       }], { session });
// //     }

// //     await session.commitTransaction();
// //     return order[0];
// //   } catch (error) {
// //     await session.abortTransaction();
// //     throw error;
// //   } finally {
// //     session.endSession();
// //   }
// // }

// // async function refundOrder(orderId, user) {
// //   const session = await mongoose.startSession();

// //   try {
// //     session.startTransaction();

// //     const order = await Order.findById(orderId).session(session);
// //     if (!order) throw new ApiError(404, 'Order not found');
// //     if (order.status === 'refunded') throw new ApiError(400, 'Order already refunded');

// //     const lineItems = await OrderLineItem.find({ orderId }).session(session);

// //     for (const line of lineItems) {
// //       const stock = await InventoryStock.findOne({
// //         storeId: order.storeId,
// //         productId: line.productId,
// //         variantId: line.variantId,
// //       }).session(session);

// //       if (!stock) throw new ApiError(404, `Stock not found for SKU ${line.sku}`);

// //       const beforeQty = stock.quantityOnHand;
// //       const afterQty = beforeQty + line.quantity;
// //       stock.quantityOnHand = afterQty;
// //       await stock.save({ session });

// //       await InventoryLedger.create([{
// //         storeId: order.storeId,
// //         productId: line.productId,
// //         variantId: line.variantId,
// //         sku: line.sku,
// //         type: 'refund',
// //         quantityChange: line.quantity,
// //         beforeQty,
// //         afterQty,
// //         referenceType: 'refund',
// //         referenceId: order._id,
// //         createdBy: user._id,
// //       }], { session });
// //     }

// //     order.status = 'refunded';
// //     await order.save({ session });
// //     await session.commitTransaction();
// //     return order;
// //   } catch (error) {
// //     await session.abortTransaction();
// //     throw error;
// //   } finally {
// //     session.endSession();
// //   }
// // }

// // module.exports = { createPOSOrder, refundOrder };
