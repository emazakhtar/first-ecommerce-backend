const { Review } = require("../models/Review"); // Adjust the path as necessary
const mongoose = require("mongoose");

// Create a new review
exports.createReview = async (req, res) => {
  const { productId, email, rating, comment } = req.body;
  console.log(req.body);
  try {
    const newReview = new Review({
      productId,
      email,
      rating,
      comment,
    });

    const savedReview = await newReview.save();
    console.log(savedReview);
    res.status(201).json({
      success: true,
      data: savedReview,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error creating review",
      error: error.message,
    });
  }
};

// Update an existing review
exports.updateReview = async (req, res) => {
  const { reviewId } = req.params;

  try {
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!updatedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating review",
      error: error.message,
    });
  }
};

// Fetch all reviews for a specific product
exports.fetchAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find(); // Populate user details
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching reviews",
      error: error.message,
    });
  }
};
