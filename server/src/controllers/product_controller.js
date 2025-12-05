import { getModel } from "../config/database.js";

const get_products = async (req, res) => {
  const { Product } = getModel();

  const id = req.params.id || req.query.id;
  if (id) {
    try {
      const product = await Product.findOne({ where: { Product_Id: id } });
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      return res.json(product);
    } catch (err) {
      console.error("Error fetching product by id:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  const index = req.params.index || req.query.index;
  if (index) {
    try {
      const product = await Product.findByPk(index);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      return res.json(product);
    } catch (err) {
      console.error("Error fetching product by index:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // filtering, sorting, and pagination
  const { categoryId, sortBy, order = "ASC", page = 1, limit = 10 } = req.query;

  try {
    const options = {
      where: {},
      order: [],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    };

    if (categoryId) {
      options.where.Category_Id = categoryId;
    }

    // Default sort
    if (sortBy) {
      const validSortFields = ["Price", "Name", "create_at"];
      if (validSortFields.includes(sortBy)) {
        options.order.push([
          sortBy,
          order.toUpperCase() === "DESC" ? "DESC" : "ASC",
        ]);
      }
    } else {
      options.order.push(["create_at", "DESC"]); // Default sort by newest
    }

    const { count, rows } = await Product.findAndCountAll(options);

    res.json({
      totalItems: count,
      totalPages: Math.ceil(count / options.limit),
      currentPage: parseInt(page),
      products: rows,
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const update_product = (req, res) => {
  const { Product } = getModel();
  const productId = req.params.id || req.query.id;

  if (!productId) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  const updateData = req.body;

  Product.update(updateData, { where: { Product_Id: productId } })
    .then(([updatedRows]) => {
      if (updatedRows === 0) {
        return res
          .status(404)
          .json({ error: "Product not found or no changes made" });
      }
      res.json({ message: "Product updated successfully" });
    })
    .catch((err) => {
      console.error("Error updating product:", err);
      res.status(500).json({ error: "Internal server error" });
    });
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

  const newProduct = req.body;

  // check required fields
  if (!newProduct.Name || !newProduct.Price || !newProduct.Author) {
    return res
      .status(400)
      .json({ error: "Name, Price, and Author are required" });
  }

  // auto generate Product_Id
  newProduct.Product_Id = await generateProductId(Product);
  newProduct.create_at = new Date();

  Product.create(newProduct)
    .then((product) => {
      res.status(201).json(product);
    })
    .catch((err) => {
      console.error("Error creating product:", err);
      res.status(500).json({ error: "Internal server error" });
    });
};

const delete_product = (req, res) => {
  const { Product } = getModel();
  const productId = req.params.id || req.query.id;
  const auth = req.params.auth || req.query.auth;

  // TODO: implement proper authentication and authorization
  if (auth !== "admin-secret") {
    return res.status(403).json({ error: "Unauthorized" });
  }

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
