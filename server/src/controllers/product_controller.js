const get_all_products = (res) => {
  const { Product } = getModel();

  Product.findAll()
  .then(products => {
    res.json(products);
  })
  .catch(err => {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Internal server error"});
  });
};

const get_product_by_index = (index,res) => {
  const { Product } = getModel();
  const productIndex = index;
  
  if (!productIndex) {
    return res.status(400).json({ error: "Product Index is required" });
  }

  Product.findByPk(productIndex)
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
  const id = req.params.id || req.query.id;
  const index = req.params.index || req.query.index;

  if (id) {
    return get_product_by_id(id,res);
  } else if (index) {
    return get_product_by_index(index,res);
  } else {
    var isAdmin = true; // TODO: replace with real admin check
    if(isAdmin){
      return get_all_products(res);
    }
  }

  return res.status(400).json({ error: "Product ID or Index is required" });
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
        return res.status(404).json({ error: "Product not found or no changes made" });
      }
      res.json({ message: "Product updated successfully" });
    })
    .catch(err => {
      console.error("Error updating product:", err);
      res.status(500).json({ error: "Internal server error" });
    });
};

const generateProductId = async (Product) => {
  const lastProduct = await Product.findOne({
    order: [['Index', 'DESC']]
  });
  
  let newIdNumber = 1;
  if (lastProduct && lastProduct.Product_Id) {
    const lastId = lastProduct.Product_Id;
    const lastIdNumber = parseInt(lastId.replace(/\D/g, ''), 10);
    newIdNumber = lastIdNumber + 1;
  }
  return `P${String(newIdNumber).padStart(7, '0')}`;
};

const create_product = async (req, res) => {
  const { Product } = getModel();

  const newProduct = req.body;

  // check required fields
  if (!newProduct.Name || !newProduct.Price) {
    return res.status(400).json({ error: "Name, and Price are required" });
  }

  // auto generate Product_Id
  newProduct.Product_Id = await generateProductId(Product);
  newProduct.create_at = new Date();

  Product.create(newProduct)
    .then(product => {
      res.status(201).json(product);
    })
    .catch(err => {
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
    .then(deletedRows => {
      if (deletedRows === 0) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    })
    .catch(err => {
      console.error("Error deleting product:", err);
      res.status(500).json({ error: "Internal server error" });
    });
};


export { create_product, delete_product, get_products, update_product };
