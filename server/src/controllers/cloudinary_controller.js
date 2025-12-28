import cloudinary from 'cloudinary';
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_NAME } from '../config/env.js';
import { getModel } from '../config/database.js';

cloudinary.v2.config({ 
    cloud_name: CLOUDINARY_NAME, 
    api_key: CLOUDINARY_API_KEY, 
    api_secret: CLOUDINARY_API_SECRET
});

const uploadImage = async (req, res) => {
    try {
        const { Product } = getModel();
        const productId = req.body.productId;

        if(!productId) {
            return res.status(400).json({ error: "Product ID is required" });
        }
        const product = await Product.findOne({ where: { Product_Id: productId } });

        if(!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // check frist if product already has an image, if so delete it from cloudinary
        if(product.Photo_Id) {
            await cloudinary.v2.uploader.destroy(product.Photo_Id);
        }
        
        const uploadStream = cloudinary.uploader.upload_stream(
            async (result) => {
              const imageUrl = result.secure_url; 
              const publicId = result.public_id;

              product.Photo_URL = imageUrl;
              product.Photo_Id = publicId;
              await product.save();

              res.status(200).json({ 
                message: "Image uploaded successfully", 
                imageUrl: imageUrl,
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

export { uploadImage };
