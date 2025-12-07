import { Op } from "sequelize";
import { getModel } from "../config/database.js";

// Validation helper function
const validateProductFields = (fields, isUpdate = false) => {
  const { Name, Author, Description, Price, Photo_Id, Category_Id } = fields;
  const errors = [];

  // Check required fields (only for create, not update)
  if (!isUpdate) {
    if (!Name) errors.push("Name is required");
    if (!Author) errors.push("Author is required");
    if (Price === undefined || Price === null) errors.push("Price is required");
  }

  // Check if at least one field is provided for update
  if (isUpdate && !Name && !Author && !Description && Price === undefined && !Photo_Id && Category_Id === undefined) {
    errors.push("At least one field is required to update");
  }

  // Validate Price if provided
  if (Price !== undefined && Price !== null) {
    if (isNaN(Price) || parseFloat(Price) < 0) {
      errors.push("Price must be a valid positive number");
    }
  }

  // Validate Category_Id if provided (must be integer or null)
  if (Category_Id !== undefined && Category_Id !== null) {
    if (!Number.isInteger(Category_Id) && !Number.isInteger(parseInt(Category_Id))) {
      errors.push("Category_Id must be a valid integer");
    }
  }


  return {
    isValid: errors.length === 0,
    errors
  };
};

const get_product_normal = async (req, res) => {
  const { Product } = getModel();
  
  // Get pagination parameters from query
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const offset = (page - 1) * limit;
  
  // Build where clause for search
  const whereClause = search ? {
    Name: { [Op.iLike]: `%${search}%` }
  } : {};
  
  try {
    // Execute count and findAll in parallel
    const [total, products] = await Promise.all([
      Product.count({ where: whereClause }),
      Product.findAll({
        where: whereClause,
        limit: limit,
        offset: offset
      })
    ]);
    
    const totalPage = Math.ceil(total / limit);
    
    res.json({
      totalPage,
      total,
      data: products
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Internal server error"});
  }
};


const get_product_by_id = (id,res) => {
  const { Product } = getModel();
  const productId = id;

  if (!productId) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  Product.findOne({ where: { Product_Id: productId } })
    .then(product => {
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    })
    .catch(err => {
      console.error("Error fetching product:", err);
      res.status(500).json({ error: "Internal server error" });
    });
};

const get_products = (req, res) => {
  const id = req.params.id;

  if (id) {
    return get_product_by_id(id,res);
  }
  
  return get_product_normal(req, res);
};

const update_product = async (req, res) => {
  const { Product } = getModel();
  const productId = req.params.id;

  if (!productId) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  const { Name, Author, Description, Price, Photo_Id, Category_Id } = req.body;

  // Validate fields using helper function (isUpdate = true)
  const validation = validateProductFields(req.body, true);
  if (!validation.isValid) {
    return res.status(400).json({ 
      error: "Validation failed",
      details: validation.errors,
      allowedFields: ["Name", "Author", "Description", "Price", "Photo_Id", "Category_Id"]
    });
  }

  try {
    // Check if product exists
    const product = await Product.findOne({ where: { Product_Id: productId } });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Build update object with only provided fields
    const updateData = {};
    if (Name !== undefined) updateData.Name = Name;
    if (Author !== undefined) updateData.Author = Author;
    if (Description !== undefined) updateData.Description = Description;
    if (Price !== undefined) updateData.Price = Price;
    if (Photo_Id !== undefined) updateData.Photo_Id = Photo_Id;
    if (Category_Id !== undefined) updateData.Category_Id = Category_Id;

    // Update product and return updated data
    const [affectedCount, affectedRows] = await Product.update(updateData, { 
      where: { Product_Id: productId },
      returning: true
    });

    res.json({
      message: "Product updated successfully",
      data: affectedRows[0]
    });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const generateProductId = async (Product) => {
  const lastProduct = await Product.findOne({
    order: [["Index", "DESC"]],
  });

  let newIdNumber = 1;
  if (lastProduct && lastProduct.Product_Id) {
    const lastId = lastProduct.Product_Id;
    const lastIdNumber = parseInt(lastId.replace(/\D/g, ""), 10);
    newIdNumber = lastIdNumber + 1;
  }
  return `P${String(newIdNumber).padStart(7, "0")}`;
};

const create_product = async (req, res) => {
  const { Product } = getModel();
  const { Name, Author, Description, Price, Photo_Id, Category_Id } = req.body;

  // Validate fields using helper function
  const validation = validateProductFields(req.body, false);
  if (!validation.isValid) {
    return res.status(400).json({ 
      error: "Validation failed",
      details: validation.errors,
      required: ["Name", "Author", "Price"]
    });
  }

  try {
    // Auto generate Product_Id
    const Product_Id = await generateProductId(Product);

    const product = await Product.create({
      Product_Id,
      Name,
      Author,
      Description,
      Price,
      Photo_Id,
      Category_Id,
      created_at: new Date()
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const delete_product = (req, res) => {
  const { Product } = getModel();
  const productId = req.params.id;

  if (!productId) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  Product.destroy({ where: { Product_Id: productId } })
    .then((deletedRows) => {
      if (deletedRows === 0) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    })
    .catch((err) => {
      console.error("Error deleting product:", err);
      res.status(500).json({ error: "Internal server error" });
    });
};

export { create_product, delete_product, get_products, update_product };
