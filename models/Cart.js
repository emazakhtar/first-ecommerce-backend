const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const cartSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  quantity: { type: Number, required: true, min: 1, max: 10 },
  color: { type: String },
  size: { type: String },
});

const virtualId = cartSchema.virtual("id");
virtualId.get(function () {
  return this._id;
});

cartSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Cart = mongoose.model("Cart", cartSchema);
