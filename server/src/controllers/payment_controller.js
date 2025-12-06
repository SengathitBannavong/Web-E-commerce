import { getModel } from "../config/database.js";

const get_all_payments = async (req, res) => {
  try {
    const { Payment } = getModel();
    
    // Get pagination parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Execute count and findAll in parallel
    const [total, payments] = await Promise.all([
      Payment.count(),
      Payment.findAll({
        limit: limit,
        offset: offset
      })
    ]);
    
    const totalPage = Math.ceil(total / limit);
    
    res.json({
      totalPage,
      total,
      data: payments
    });
  } catch (err) {
    console.error("Error fetching payments:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const get_payments_by_order_id = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    if (!orderId) {
      return res.status(400).json({ error: "Order ID is required" });
    }

    const { Payment } = getModel();
    
    // Get pagination parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Execute count and findAll in parallel
    const [total, payments] = await Promise.all([
      Payment.count({ where: { Order_Id: orderId } }),
      Payment.findAll({ 
        where: { Order_Id: orderId },
        limit: limit,
        offset: offset
      })
    ]);
    
    const totalPage = Math.ceil(total / limit);
    
    res.json({
      totalPage,
      total,
      data: payments
    });
  } catch (err) {
    console.error("Error fetching payments by order ID:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const create_payment = async (req, res) => {
  try {
    const { Payment } = getModel();
    const { orderId, userId , type, amount, status } = req.body;

    // Validate required fields
    if (!orderId || !userId || !type || !amount) {
      return res.status(400).json({ 
        error: "Order_Id, User_Id, Type, and Amount are required",
        required: ["orderId", "userId", "type", "amount"]
      });
    }

    // Validate Order_Id and User_Id as integers/strings
    if (isNaN(orderId)) {
      return res.status(400).json({ error: "Order_Id must be a valid integer" });
    }
    if (typeof userId !== 'string' || userId.length === 0) {
      return res.status(400).json({ error: "User_Id must be a valid non-empty string" });
    }

    // Validate payment type
    const validTypes = ["credit_card", "paypal", "bank_transfer"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: `Invalid payment type. Valid types are: ${validTypes.join(", ")}` });
    }

    // Validate amount
    if (isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ error: "Amount must be a positive number" });
    }

    const newPayment = await Payment.create({
      Order_Id: orderId,
      User_Id: userId,
      Type: type,
      Amount: amount,
      Status: status || 'pending'
    });

    res.status(201).json({
      message: "Payment created successfully",
      payment: newPayment
    });
  } catch (err) {
    console.error("Error creating payment:", err);
    if (err.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(404).json({ error: "Referenced Order or User does not exist" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

const update_payment = async (req, res) => {
  try {
    const { Payment } = getModel();
    const id = req.params.id || req.query.id;
    const { type, amount, status } = req.body;

    // Validate payment type
    const validTypes = ["credit_card", "paypal", "bank_transfer"];
    if (type && !validTypes.includes(type)) {
      return res.status(400).json({ error: `Invalid payment type. Valid types are: ${validTypes.join(", ")}` });
    }

    // Validate amount
    if (amount && (isNaN(amount) || Number(amount) <= 0)) {
      return res.status(400).json({ error: "Amount must be a positive number" });
    }

    // Validate payment status
    const validStatuses = ["pending", "completed", "failed"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid payment status. Valid statuses are: ${validStatuses.join(", ")}` });
    }

    if (!id) {
      return res.status(400).json({ error: "Payment ID is required" });
    }

    const payment = await Payment.findByPk(id);

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    // Update only provided fields
    if (type !== undefined) payment.Type = type;
    if (amount !== undefined) payment.Amount = amount;
    if (status !== undefined) payment.Status = status;

    await payment.save();

    res.json({
      message: "Payment updated successfully",
      payment
    });
  } catch (err) {
    console.error("Error updating payment:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const delete_payment = async (req, res) => {
  try {
    const { Payment } = getModel();
    const id = req.params.id || req.query.id;
    const auth = req.headers.authorization;

    // TODO: Implement proper authentication and authorization
    if (auth !== "admin-secret") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (!id) {
      return res.status(400).json({ error: "Payment ID is required" });
    }

    const deletedRows = await Payment.destroy({ where: { Payment_Id: id } });

    if (deletedRows === 0) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res.json({ message: "Payment deleted successfully" });
  } catch (err) {
    console.error("Error deleting payment:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { create_payment, delete_payment, get_all_payments, get_payments_by_order_id, update_payment };
