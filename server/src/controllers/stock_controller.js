import { getModel } from "../config/database.js";

/**
 * Get all stocks with pagination
 */
const get_all_stocks = async (req, res) => {
    try {
        const { Stock, Product } = getModel();
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const total = await Stock.count();
        
        const result = await Stock.findAll({
          attributes: [
            'Stock_Id',
            'Product_Id',
            'Quantity',
            'Last_Updated',
            [Stock.sequelize.col('product.Name'), 'Product_Name'],
            [Stock.sequelize.col('product.Price'), 'Product_Price']
          ],
          include: [{
            model: Product,
            as: 'product',
            attributes: [],
            required: false 
          }],
          limit: parseInt(limit),
          offset: parseInt(offset),
          subQuery: false,
          raw: true,
          order: [['Product_Id', 'ASC']]
        });
        
        res.json({
            total: total,
            data: result
        });
    } catch (err) {
        console.error("Error fetching stocks:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Get stock by product ID
 */
const get_stock_by_product_id = async (req, res) => {
    try {
        const { Stock } = getModel();
        const productId = req.params.productId;
        
        if (!productId) {
            return res.status(400).json({ error: "Product ID is required" });
        }
        
        const stock = await Stock.findOne({ where: { Product_Id: productId } });
        
        if (!stock) {
            return res.status(404).json({ error: "Stock not found for this product" });
        }
        
        res.json(stock);
    } catch (err) {
        console.error("Error fetching stock:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Create or update stock for a product
 */
const upsert_stock = async (req, res) => {
    try {
        const { Stock, Product } = getModel();
        const { productId, quantity } = req.body;
        
        if (!productId) {
            return res.status(400).json({ error: "Product ID is required" });
        }
        
        if (quantity === undefined || quantity === null) {
            return res.status(400).json({ error: "Quantity is required" });
        }
        
        if (isNaN(quantity) || parseInt(quantity) < 0) {
            return res.status(400).json({ error: "Quantity must be a valid non-negative number" });
        }
        
        // Check if product exists
        const product = await Product.findOne({ where: { Product_Id: productId } });
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        
        // Check if stock exists for this product
        let stock = await Stock.findOne({ where: { Product_Id: productId } });
        
        if (stock) {
            // Update existing stock
            await Stock.update(
                { 
                    Quantity: parseInt(quantity),
                    Last_Updated: new Date()
                },
                { where: { Product_Id: productId } }
            );
            stock = await Stock.findOne({ where: { Product_Id: productId } });
            
            res.json({
                message: "Stock updated successfully",
                data: stock
            });
        } else {
            // Create new stock
            stock = await Stock.create({
                Product_Id: productId,
                Quantity: parseInt(quantity),
                Last_Updated: new Date()
            });
            
            res.status(201).json({
                message: "Stock created successfully",
                data: stock
            });
        }
    } catch (err) {
        console.error("Error upserting stock:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Update stock quantity (add or subtract)
 */
const update_stock_quantity = async (req, res) => {
    try {
        const { Stock } = getModel();
        const productId = req.params.productId;
        const { change } = req.body; // positive to add, negative to subtract
        
        if (!productId) {
            return res.status(400).json({ error: "Product ID is required" });
        }
        
        if (change === undefined || change === null) {
            return res.status(400).json({ error: "Change value is required" });
        }
        
        const stock = await Stock.findOne({ where: { Product_Id: productId } });
        
        if (!stock) {
            return res.status(404).json({ error: "Stock not found for this product" });
        }
        
        const newQuantity = stock.Quantity + parseInt(change);
        
        if (newQuantity < 0) {
            return res.status(400).json({ error: "Insufficient stock" });
        }
        
        await Stock.update(
            { 
                Quantity: newQuantity,
                Last_Updated: new Date()
            },
            { where: { Product_Id: productId } }
        );
        
        const updatedStock = await Stock.findOne({ where: { Product_Id: productId } });
        
        res.json({
            message: "Stock quantity updated successfully",
            data: updatedStock
        });
    } catch (err) {
        console.error("Error updating stock quantity:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Delete stock
 */
const delete_stock = async (req, res) => {
    try {
        const { Stock } = getModel();
        const productId = req.params.productId;
        
        if (!productId) {
            return res.status(400).json({ error: "Product ID is required" });
        }
        
        const deletedCount = await Stock.destroy({ where: { Product_Id: productId } });
        
        if (deletedCount === 0) {
            return res.status(404).json({ error: "Stock not found" });
        }
        
        res.json({ message: "Stock deleted successfully" });
    } catch (err) {
        console.error("Error deleting stock:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export {
  delete_stock, get_all_stocks,
  get_stock_by_product_id, update_stock_quantity, upsert_stock
};

