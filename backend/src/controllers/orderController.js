// backend/src/controllers/orderController.js
import Order from "../models/Order.js";

/** Dummy payment processor: simulates success */
async function processPaymentDummy(amount) {
  // simulate async work
  return { success: true, transactionId: `DUMMY-${Date.now()}` };
}

export const createOrder = async (req, res) => {
  try {
    const { items, total, customerName, type, address, paymentMode } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order must include items" });
    }
    if (typeof total !== 'number') {
      return res.status(400).json({ message: "Total must be a number" });
    }

    let paymentStatus = 'pending';
    let transactionId = null;

    if (paymentMode === 'online') {
      // call dummy payment
      const result = await processPaymentDummy(total);
      if (!result.success) {
        return res.status(402).json({ message: "Payment failed" });
      }
      paymentStatus = 'paid';
      transactionId = result.transactionId;
    }

    const order = await Order.create({
      items,
      total,
      customerName,
      type: type === 'delivery' ? 'delivery' : 'collection',
      address: type === 'delivery' ? address : undefined,
      paymentMode: paymentMode === 'online' ? 'online' : 'cash',
      paymentStatus,
      transactionId
    });

    return res.status(201).json(order);
  } catch (err) {
    console.error("createOrder err:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    console.error("getOrders err:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, readyInMinutes } = req.body;

    if (!['pending', 'accepted', 'rejected', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updateData = { status };
    if (status === 'accepted' && readyInMinutes) {
      // add estimated ready time
      updateData.readyBy = new Date(Date.now() + readyInMinutes * 60000);
    }

    const order = await Order.findByIdAndUpdate(id, updateData, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });

    return res.json(order);
  } catch (err) {
    console.error("updateOrderStatus err:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

