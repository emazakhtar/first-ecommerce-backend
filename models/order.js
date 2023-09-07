const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const orderSchema = new Schema({
  cartItems: { type: [Schema.Types.Mixed], required: true },
  totalItems: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  selectedAddress: { type: Schema.Types.Mixed, required: true },
  paymentMethod: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, required: true },
});

const virtualId = orderSchema.virtual("id");
virtualId.get(function () {
  return this._id;
});

orderSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Order = mongoose.model("Order", orderSchema);
