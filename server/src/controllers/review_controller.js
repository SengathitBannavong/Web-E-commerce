import { getModel } from "../config/database.js";
import { generateReviewId } from "../util/idGenerator.js";

// Validation helper for reviews
const validateReviewFields = (fields, isUpdate = false) => {
  const { Product_Id, Rating, Title, Content } = fields;
  const errors = [];

  if (!isUpdate) {
    if (!Product_Id) errors.push("Product_Id is required");
    if (!Rating) errors.push("Rating is required");
    if (!Title) errors.push("Title is required");
    if (!Content) errors.push("Content is required");
  }

  if (Rating !== undefined) {
    if (isNaN(Rating) || parseInt(Rating) < 1 || parseInt(Rating) > 5) {
      errors.push("Rating must be between 1 and 5");
    }
  }

  if (Title !== undefined && (Title.length < 5 || Title.length > 200)) {
    errors.push("Title must be between 5 and 200 characters");
  }

  if (Content !== undefined && (Content.length < 10 || Content.length > 2000)) {
    errors.push("Content must be between 10 and 2000 characters");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Get reviews for a product
const getProductReviews = async (req, res) => {
  try {
    const { Review, User } = getModel();
    const { productId } = req.params;
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'created_at';
    const sortOrder = req.query.sortOrder || 'DESC';
    const offset = (page - 1) * limit;

    const validSortFields = ['created_at', 'Rating', 'Helpful_Count'];
    if (!validSortFields.includes(sortBy)) {
      return res.status(400).json({ error: "Invalid sort field" });
    }

    const { count, rows: reviews } = await Review.findAndCountAll({
      where: { 
        Product_Id: productId,
        Status: 'approved'
      },
      include: [{
        model: User,
        as: 'user',
        attributes: ['Name', 'User_Id']
      }],
      order: [[sortBy, sortOrder]],
      limit,
      offset
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      totalPage: totalPages,
      total: count,
      data: reviews
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

// Create a new review
const createReview = async (req, res) => {
  try {
    const { Review, Product, User } = getModel();
    const { Product_Id, Rating, Title, Content } = req.body;
    const User_Id = req.userId;

    // Validate input
    const validation = validateReviewFields({ Product_Id, Rating, Title, Content });
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.errors.join(", ") });
    }

    // Check if product exists
    const product = await Product.findOne({ where: { Product_Id } });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ 
      where: { User_Id, Product_Id } 
    });
    if (existingReview) {
      return res.status(400).json({ error: "You have already reviewed this product" });
    }

    // Create review
    const Review_Id = generateReviewId();
    const review = await Review.create({
      Review_Id,
      User_Id,
      Product_Id,
      Rating: parseInt(Rating),
      Title,
      Content,
      Status: 'approved' // Auto-approve for now
    });

    // Get created review with user info
    const createdReview = await Review.findOne({
      where: { Review_Id },
      include: [{
        model: User,
        as: 'user',
        attributes: ['Name', 'User_Id']
      }]
    });

    res.status(201).json({
      message: "Review created successfully",
      data: createdReview
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: "Failed to create review" });
  }
};

// Update review
const updateReview = async (req, res) => {
  try {
    const { Review } = getModel();
    const { reviewId } = req.params;
    const { Rating, Title, Content } = req.body;
    const User_Id = req.userId;

    // Validate input
    const validation = validateReviewFields({ Rating, Title, Content }, true);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.errors.join(", ") });
    }

    // Find review
    const review = await Review.findOne({ 
      where: { Review_Id: reviewId, User_Id } 
    });
    if (!review) {
      return res.status(404).json({ error: "Review not found or unauthorized" });
    }

    // Update review
    await review.update({
      ...(Rating && { Rating: parseInt(Rating) }),
      ...(Title && { Title }),
      ...(Content && { Content }),
      updated_at: new Date()
    });

    res.json({
      message: "Review updated successfully",
      data: review
    });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ error: "Failed to update review" });
  }
};

// Delete review
const deleteReview = async (req, res) => {
  try {
    const { Review } = getModel();
    const { reviewId } = req.params;
    const User_Id = req.userId;

    // Find review
    const review = await Review.findOne({ 
      where: { Review_Id: reviewId, User_Id } 
    });
    if (!review) {
      return res.status(404).json({ error: "Review not found or unauthorized" });
    }

    // Delete review
    await review.destroy();

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Failed to delete review" });
  }
};

// Get review statistics for a product
const getReviewStats = async (req, res) => {
  try {
    const { Review } = getModel();
    const { productId } = req.params;

    const stats = await Review.findAll({
      where: { 
        Product_Id: productId,
        Status: 'approved'
      },
      attributes: [
        [Review.sequelize.fn('AVG', Review.sequelize.col('Rating')), 'averageRating'],
        [Review.sequelize.fn('COUNT', Review.sequelize.col('Review_Id')), 'totalReviews'],
        [Review.sequelize.fn('COUNT', Review.sequelize.literal('CASE WHEN "Review"."Rating" = 5 THEN 1 END')), 'fiveStars'],
        [Review.sequelize.fn('COUNT', Review.sequelize.literal('CASE WHEN "Review"."Rating" = 4 THEN 1 END')), 'fourStars'],
        [Review.sequelize.fn('COUNT', Review.sequelize.literal('CASE WHEN "Review"."Rating" = 3 THEN 1 END')), 'threeStars'],
        [Review.sequelize.fn('COUNT', Review.sequelize.literal('CASE WHEN "Review"."Rating" = 2 THEN 1 END')), 'twoStars'],
        [Review.sequelize.fn('COUNT', Review.sequelize.literal('CASE WHEN "Review"."Rating" = 1 THEN 1 END')), 'oneStar']
      ],
      raw: true
    });

    const result = stats[0];
    result.averageRating = parseFloat(result.averageRating) || 0;
    result.totalReviews = parseInt(result.totalReviews) || 0;

    res.json({ data: result });
  } catch (error) {
    console.error("Error fetching review stats:", error);
    res.status(500).json({ error: "Failed to fetch review statistics" });
  }
};

// Mark review as helpful
const markReviewHelpful = async (req, res) => {
  try {
    const { Review } = getModel();
    const { reviewId } = req.params;

    const review = await Review.findOne({ where: { Review_Id: reviewId } });
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    await review.increment('Helpful_Count');

    res.json({ message: "Review marked as helpful" });
  } catch (error) {
    console.error("Error marking review helpful:", error);
    res.status(500).json({ error: "Failed to mark review as helpful" });
  }
};

export {
  createReview, deleteReview, getProductReviews, getReviewStats,
  markReviewHelpful, updateReview
};

