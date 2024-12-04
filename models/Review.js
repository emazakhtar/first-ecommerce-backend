const { Schema } = require("mongoose");
const mongoose = require("mongoose");

// Clear the model cache if the model already exists
if (mongoose.connection.models["Return"]) {
  delete mongoose.connection.models["Return"];
}

// Define the Review Schema
const ReviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the product being reviewed
    required: true,
    ref: "Product", // Assuming you have a Product model
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1, // Minimum rating value
    max: 5, // Maximum rating value
  },
  comment: {
    type: String,
    required: true,
    trim: true, // Removes extra whitespace from both ends
  },
  status: { type: String },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically sets to the current date/time when the review is created
  },
});

const virtualId = ReviewSchema.virtual("id");
virtualId.get(function () {
  return this._id;
});

ReviewSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Review = mongoose.model("Review", ReviewSchema);
