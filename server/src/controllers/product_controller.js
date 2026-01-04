import { Op, literal } from "sequelize";
import { getDB, getModel } from "../config/database.js";
import { deleteImageHelper } from "./cloudinary_controller.js";

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

  // Validate Price if provided (Price is in VND)
  if (Price !== undefined && Price !== null) {
    if (isNaN(Price) || parseFloat(Price) < 0) {
      errors.push("Price must be a valid positive number in VND");
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
  const category = req.query.category || null;
  
  // Build where clause for search
  const whereClause = {
    ...(search ? { Name: { [Op.iLike]: `%${search}%` } } : {}),
    ...(category ? { Category_Id: category } : {})
  };
  
  try {
    // Execute count and findAll in parallel
    const [total, products] = await Promise.all([
      Product.count({ where: whereClause }),
      Product.findAll({
        where: whereClause,
        limit: limit,
        offset: offset,
        order: [['Index', 'ASC']]
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
  const { Product, Category } = getModel();
  const productId = req.params.id;

  if (!productId) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  const { Name, Author, Description, Price, Photo_Id, Category_Id } = req.body;

  const category = await Category.findOne({ where: { Category_Id: Category_Id }});
  if (!category) return res.status(400).json({ error: 'Category not found' });

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
  const { Name, Author, Description, Price, Photo_Id, Category_Id, Photo_URL } = req.body;

  // Validate fields using helper function
  const validation = validateProductFields(req.body, false);
  if (!validation.isValid) {
    return res.status(400).json({ 
      error: "Validation failed",
      details: validation.errors,
      required: ["Name", "Author", "Price"]
    });
  }

  // check category id if provided
  if (Category_Id) {
    const { Category } = getModel();
    const category = await Category.findOne({ where: { Category_Id } });
    if (!category) {
      return res.status(400).json({ error: "Invalid Category_Id" });
    }
  }

  try {
    // Use a transaction to create both product and initial stock atomically
    const sequelize = getDB();
    const t = await sequelize.transaction();
    try {
      // Auto generate Product_Id
      const Product_Id = await generateProductId(Product);

      const form = {
        Product_Id,
        Name,
        Author,
        Description,
        Price,
        Photo_Id: Photo_Id || null,
        Photo_URL: Photo_URL || null,
        Category_Id: Category_Id || null,
        created_at: new Date()
      };

      const product = await Product.create(form, { transaction: t });

      // create initial stock record with quantity 0
      const { Stock } = getModel();
      await Stock.create({ Product_Index: product.Index, Quantity: 0, Last_Updated: new Date() }, { transaction: t });

      await t.commit();
      res.status(201).json(product);
    } catch (err) {
      await t.rollback();
      throw err;
    }
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const delete_product = async (req, res) => {
  const { Product } = getModel();
  const productId = req.params.id;

  if (!productId) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  const product = await Product.findOne({ where: { Product_Id: productId } });
  if(!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  // delete Photo from Cloudinary if exists
  await deleteImageHelper(product.Photo_Id);

  try {
    const deletedCount = await Product.destroy({ where: { Product_Id: productId } });
    if (deletedCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const get_bestsellers = async (req, res) => {
  const { Product, OrderItem } = getModel();
  
  // Get pagination parameters
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;
  
  try {
    const sequelize = getDB();
    
    // Get bestsellers by aggregating order items
    const bestsellers = await Product.findAll({
      attributes: [
        'Product_Id',
        'Index',
        'Name',
        'Author',
        'Description',
        'Price',
        'Photo_Id',
        'Photo_URL',
        'Category_Id',
        [literal('COALESCE(SUM("orderItems"."Quantity"), 0)'), 'total_sold']
      ],
      include: [{
        model: OrderItem,
        as: 'orderItems',
        attributes: [],
        required: false
      }],
      group: ['Product.Index', 'Product.Product_Id'],
      order: [[literal('total_sold'), 'DESC']],
      limit: limit,
      offset: offset,
      subQuery: false
    });
    
    // Get total count of products with sales
    const totalCount = await Product.count({
      distinct: true,
      include: [{
        model: OrderItem,
        as: 'orderItems',
        required: false
      }]
    });
    
    const totalPage = Math.ceil(totalCount / limit);
    
    res.json({
      totalPage,
      total: totalCount,
      data: bestsellers
    });
  } catch (err) {
    console.error("Error fetching bestsellers:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
};

const get_new_releases = async (req, res) => {
  const { Product } = getModel();
  
  // Get pagination parameters
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;
  
  try {
    // Get newest products by created_at date
    const [total, products] = await Promise.all([
      Product.count(),
      Product.findAll({
        order: [['created_at', 'DESC']],
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
    console.error("Error fetching new releases:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { create_product, delete_product, get_bestsellers, get_new_releases, get_products, update_product };
