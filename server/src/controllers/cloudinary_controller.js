import cloudinary from 'cloudinary';
import { getModel } from '../config/database.js';
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_NAME } from '../config/env.js';

cloudinary.v2.config({ 
    cloud_name: CLOUDINARY_NAME, 
    api_key: CLOUDINARY_API_KEY, 
    api_secret: CLOUDINARY_API_SECRET
});

const uploadImage_Product = async (req, res) => {
    try {
        const { Product } = getModel();
        const productId = req.body.productId;
        let product;
        if (productId && productId !== "null") {
            product = await Product.findOne({ where: { Product_Id: productId } });
            if (product && product.Photo_Id) {
                await cloudinary.v2.uploader.destroy(product.Photo_Id);
            }
        }
        
        const uploadStream = cloudinary.uploader.upload_stream(
            async (result) => {
              const imageUrl = result.secure_url; 
              const publicId = result.public_id;

              if(product) {
                product.Photo_URL = imageUrl;
                product.Photo_Id = publicId;
                await product.save();
              }

              res.status(200).json({ 
                message: "Image uploaded successfully", 
                imageUrl: imageUrl,
                publicId: publicId
              });
          }
        );

        uploadStream.end(req.file.buffer);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send("Server Error");
        throw error;
    }
};

const deleteImage_Product = async (req, res) => {
    try {
        const { Product } = getModel();
        const { productId } = req.body;

        if(!productId) {
            return res.status(400).json({ error: "Product ID is required" });
        }
        const product = await Product.findOne({ where: { Product_Id: productId } });

        if(!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        if(product.Photo_Id) {
            await cloudinary.v2.uploader.destroy(product.Photo_Id);
            product.Photo_URL = null;
            product.Photo_Id = null;
            await product.save();
        }

        res.status(200).json({ message: "Image deleted successfully" });
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send("Server Error");
        throw error;
    }
};

const deleteImageHelper = async (publicId) => {
    if(publicId) {
        await cloudinary.v2.uploader.destroy(publicId);
    }
};

const uploadImage_Category = async (req, res) => {
    try {
        const { Category } = getModel();
        const categoryId = req.body.categoryId;
        let category;
        if (categoryId && categoryId !== "null") {
            category = await Category.findOne({ where: { Category_Id: categoryId } });
            if (category && category.Photo_Id) {
                await cloudinary.v2.uploader.destroy(category.Photo_Id);
            }
        }
        
        const uploadStream = cloudinary.uploader.upload_stream(
            async (result) => {
              const imageUrl = result.secure_url; 
              const publicId = result.public_id;

              if(category) {
                category.Photo_URL = imageUrl;
                category.Photo_Id = publicId;
                await category.save();
              }

              res.status(200).json({ 
                message: "Image uploaded successfully", 
                imageUrl: imageUrl,
                publicId: publicId
              });
          }
        );

        uploadStream.end(req.file.buffer);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send("Server Error");
        throw error;
    }
};

const uploadImage_User = async (req, res) => {
    try {
        const { User } = getModel();
        const userId = req.body.userId || req.userId;

        if (!userId || userId === "null") {
            return res.status(400).json({ error: "User ID is required" });
        }

        if (!req.file || !req.file.buffer) {
            return res.status(400).json({ error: "Image file is required" });
        }

        const user = await User.findOne({ where: { User_Id: userId } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.Profile_Id) {
            await cloudinary.v2.uploader.destroy(user.Profile_Id);
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            async (result) => {
              const imageUrl = result.secure_url;
              const publicId = result.public_id;

              user.Profile_URL = imageUrl;
              user.Profile_Id = publicId;
              await user.save();

              res.status(200).json({
                message: "Image uploaded successfully",
                imageUrl: imageUrl,
                publicId: publicId
              });
          }
        );

        uploadStream.end(req.file.buffer);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send("Server Error");
        throw error;
    }
};

const deleteImage_User = async (req, res) => {
    try {
        const { User } = getModel();
        const userId = req.body.userId || req.userId;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }
        const user = await User.findOne({ where: { User_Id: userId } });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.Profile_Id) {
            await cloudinary.v2.uploader.destroy(user.Profile_Id);
            user.Profile_URL = null;
            user.Profile_Id = null;
            await user.save();
        }

        res.status(200).json({ message: "Image deleted successfully" });
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send("Server Error");
        throw error;
    }
};

const deleteImage_Category = async (req, res) => {
  try {
        const { Category } = getModel();
        const { categoryId } = req.body;

        if(!categoryId) {
            return res.status(400).json({ error: "Category ID is required" });
        }
        const category = await Category.findOne({ where: { Category_Id: categoryId } });

        if(!category) {
            return res.status(404).json({ error: "Category not found" });
        }

        if(category.Photo_Id) {
            await cloudinary.v2.uploader.destroy(category.Photo_Id);
            category.Photo_URL = null;
            category.Photo_Id = null;
            await category.save();
        }

        res.status(200).json({ message: "Image deleted successfully" });
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send("Server Error");
        throw error;
    }
};

export { deleteImage_Category, deleteImage_Product, deleteImage_User, deleteImageHelper, uploadImage_Category, uploadImage_Product, uploadImage_User };

