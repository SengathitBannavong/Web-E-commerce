import { getModel } from "../config/database.js";

// Get all reviews for admin management
const getReviewsAdmin = async (req, res) => {
  try {
    const { Review, User, Product } = getModel();
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status || null;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      whereClause.Status = status;
    }

    const { count, rows: reviews } = await Review.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['Name', 'User_Id', 'Email']
        },
        {
          model: Product,
          as: 'product',
          attributes: ['Name', 'Product_Id']
        }
      ],
      order: [['created_at', 'DESC']],
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

// Update review status (approve/reject)
const updateReviewStatus = async (req, res) => {
  try {
    const { Review } = getModel();
    const { reviewId } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const review = await Review.findOne({ where: { Review_Id: reviewId } });
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    await review.update({ Status: status });

    res.json({
      message: `Review ${status} successfully`,
      data: review
    });
  } catch (error) {
    console.error("Error updating review status:", error);
    res.status(500).json({ error: "Failed to update review status" });
  }
};

// Delete review (admin)
const deleteReviewAdmin = async (req, res) => {
  try {
    const { Review } = getModel();
    const { reviewId } = req.params;

    const review = await Review.findOne({ where: { Review_Id: reviewId } });
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Delete review
    await review.destroy();

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Failed to delete review" });
  }
};

// Get review statistics for admin dashboard
const getReviewStatistics = async (req, res) => {
  try {
    const { Review } = getModel();

    const stats = await Review.findAll({
      attributes: [
        [Review.sequelize.fn('COUNT', Review.sequelize.col('Review_Id')), 'totalReviews'],
        [Review.sequelize.fn('COUNT', Review.sequelize.literal("CASE WHEN Status = 'approved' THEN 1 END")), 'approvedReviews'],
        [Review.sequelize.fn('COUNT', Review.sequelize.literal("CASE WHEN Status = 'pending' THEN 1 END")), 'pendingReviews'],
        [Review.sequelize.fn('COUNT', Review.sequelize.literal("CASE WHEN Status = 'rejected' THEN 1 END")), 'rejectedReviews'],
        [Review.sequelize.fn('AVG', Review.sequelize.col('Rating')), 'averageRating']
      ],
      raw: true
    });

    const result = stats[0];
    result.averageRating = parseFloat(result.averageRating) || 0;
    result.totalReviews = parseInt(result.totalReviews) || 0;
    result.approvedReviews = parseInt(result.approvedReviews) || 0;
    result.pendingReviews = parseInt(result.pendingReviews) || 0;
    result.rejectedReviews = parseInt(result.rejectedReviews) || 0;

    res.json({ data: result });
  } catch (error) {
    console.error("Error fetching review statistics:", error);
    res.status(500).json({ error: "Failed to fetch review statistics" });
  }
};

export {
    deleteReviewAdmin, getReviewsAdmin, getReviewStatistics, updateReviewStatus
};
