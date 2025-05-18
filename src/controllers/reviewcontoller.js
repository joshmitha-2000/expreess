const reviewService = require('../services/reviewservice');

async function postReview(req, res) {
  try {
    const userId = req.user.userId; // <-- use userId from req.user
    const { productId, rating, comment } = req.body;

    // Basic validation
    if (!productId || !rating || !comment) {
      return res.status(400).json({ error: "productId, rating and comment are required" });
    }

    // Create review
    const review = await reviewService.createReview(userId, productId, rating, comment);
    res.status(201).json({ message: 'Review created successfully', review });
  } catch (error) {
    console.error('Error posting review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getReviews(req, res) {
  try {
    const productId = parseInt(req.params.productId);

    if (!productId) {
      return res.status(400).json({ error: 'Invalid productId' });
    }

    const reviews = await reviewService.getReviewsByProduct(productId);
    const formattedReviews = reviews.map(r => ({
      username: r.user.username,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
    }));

    res.json(formattedReviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  postReview,
  getReviews,
};
