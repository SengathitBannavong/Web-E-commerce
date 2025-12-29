import { getModel } from "../config/database.js";

const getCategories = async (req, res) => {
  const { Category } = getModel();
  const { id } = req.params;
  const { search } = req.query;
  try {
    if (id) {
      const category = await Category.findOne({ where: { Category_Id: id } });
      res.json(category);
    } else if(search) {
      const categories = await Category.findAll({
        where: {
          Name: {
            [Op.iLike]: `%${search}%`
          }
        }
      });
      res.json(categories);
    } else {
      // Get pagination parameters from query
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      
      // Execute count and findAll in parallel
      const [total, categories] = await Promise.all([
        Category.count(),
        Category.findAll({
          limit: limit,
          offset: offset
        })
      ]);
      
      const totalPage = Math.ceil(total / limit);
      
      res.json({
        totalPage,
        total,
        data: categories
      });
    }
  } catch (e) {
    console.error("[ERROR] Error fetching categories:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};

const createCategory = async (req, res) => {
    const { Category } = getModel();
    const { name, description, Photo_Id, Photo_URL } = req.body;
    if (!name) {
        return res.status(400).json({ error: "Category name is required" });
    }

    try {
        const newCategory = await Category.create({ Name: name, Description: description, Photo_Id, Photo_URL });
        const res_ = {
          message: "Category created successfully",
          id: newCategory.Category_Id
        }
        res.status(201).json(res_);
    } catch (e) {
        console.error("[ERROR] Error creating category:", e);
        if (e.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: e.errors.map(err => err.message).join(', ') });
        }
        res.status(500).json({ error: "Internal server error" });
    }
};

const updateCategory = async (req, res) => {
    const { Category } = getModel();
    const id = req.params.id || req.query.id;
    const { name, description,Photo_Id, Photo_URL } = req.body;

    if (!id) {
        return res.status(400).json({ error: "Category ID is required" });
    }
    
    try {
      const category = await Category.findOne({ where: { Category_Id: id } });
      if (!category) {
          return res.status(404).json({ error: "Category not found" });
      }

      category.Name = name || category.Name;
      category.Description = description ||  category.Description;
      category.Photo_Id = Photo_Id || category.Photo_Id;
      category.Photo_URL = Photo_URL || category.Photo_URL;
      await category.save();
      res.json({ message: `Category with ID ${id} updated successfully` });
    } catch (e) {
        console.error("[ERROR] Error updating category:", e);
        res.status(500).json({ error: "Internal server error" });
    }
};

const deleteCategory = async (req, res) => {
    const { Category } = getModel();
    const id = req.params.id || req.query.id;

    if (!id) {
        return res.status(400).json({ error: "Category ID is required" });
    }

    try {
        const deletedRows = await Category.destroy({ where: { Category_Id: id } });
        if (deletedRows === 0) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.json({ message: `Category with ID ${id} deleted successfully` });
    } catch (e) {
        console.error("[ERROR] Error deleting category:", e);
        res.status(500).json({ error: "Internal server error" });
    }
};

export { createCategory, deleteCategory, getCategories, updateCategory };
