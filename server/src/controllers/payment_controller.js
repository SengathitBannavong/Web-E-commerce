import { getModel } from "../config/database.js";

// Valid payment types
const validTypes = ["credit_card", "paypal", "bank_transfer"];

// Valid payment statuses
const validStatuses = ["pending", "completed", "failed"];

const get_all_payments = async (req, res) => {
  try {
    const { Payment } = getModel();
    
    // Get pagination parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Get filter parameters
    const { status, userId } = req.query;
    
    const whereClause = {};

    if (status) {
        whereClause.Status = status;
    }

    if (userId) {
        whereClause.User_Id = userId;
    }
    
    // Execute count and findAll in parallel
    const [total, payments] = await Promise.all([
      Payment.count({ where: whereClause }),
      Payment.findAll({
        where: whereClause,
        limit: limit,
        offset: offset,
        order: [['created_at', 'DESC']]
      })
    ]);
    
    const totalPage = Math.ceil(total / limit);
    
    const mapped = payments.map((p) => {
      const obj = p.toJSON ? p.toJSON() : p;
      return {
        ...obj,
        Date: obj.created_at || obj.createdAt || obj.CreatedAt || null,
      };
    });

    res.json({
      totalPage,
      total,
      data: mapped
    });
  } catch (err) {
    console.error("Error fetching payments:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const get_payments_by_order_id = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const status = req.query.status;
    if (!orderId) {
      return res.status(400).json({ error: "Order ID is required" });
    }

    const { Payment } = getModel();
    
    // Get pagination parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Execute count and findAll in parallel
    const where = { Order_Id: orderId };
    if (status) where.Status = status;

    const [total, payments] = await Promise.all([
      Payment.count({ where }),
      Payment.findAll({ 
        where,
        limit: limit,
        offset: offset,
        order: [['created_at', 'DESC']]
      })
    ]);
    
    const totalPage = Math.ceil(total / limit);
    
    const mapped = payments.map((p) => {
      const obj = p.toJSON ? p.toJSON() : p;
      return {
        ...obj,
        Date: obj.created_at || obj.createdAt || obj.CreatedAt || null,
      };
    });

    res.json({
      totalPage,
      total,
      data: mapped
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

    const obj = newPayment.toJSON ? newPayment.toJSON() : newPayment;
    obj.Date = obj.created_at || obj.createdAt || obj.CreatedAt || null;

    res.status(201).json({
      message: "Payment created successfully",
      payment: obj
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
    const id = req.params.id;
    const { Status } = req.body;

    // Validate payment status
    if (Status && !validStatuses.includes(Status)) {
      return res.status(400).json({ error: `Invalid payment status. Valid statuses are: ${validStatuses.join(", ")}` });
    }

    if (!id) {
      return res.status(400).json({ error: "Payment ID is required" });
    }

    const payment = await Payment.findByPk(id);

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    if(Status && payment.Status === 'completed') {
      return res.status(400).json({ error: "Cannot change status of a completed payment" });
    }

    // Update only provided fields
    if (Status !== undefined) payment.Status = Status;

    await payment.save();

    const obj = payment.toJSON ? payment.toJSON() : payment;
    obj.Date = obj.created_at || obj.createdAt || obj.CreatedAt || null;

    res.json({
      message: "Payment updated successfully",
      payment: obj
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
