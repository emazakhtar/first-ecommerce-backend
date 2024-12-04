const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/Review");

router
  .post("/create", reviewController.createReview)
  .get("/get", reviewController.fetchAllReviews)
  .patch("/update/:reviewId", reviewController.updateReview);

exports.router = router;
