const { Schema } = require("mongoose");
const mongoose = require("mongoose");

// Clear the model cache if the model already exists
if (mongoose.connection.models["Return"]) {
  delete mongoose.connection.models["Return"];
}

const ReturnSchema = new Schema(
  {
    userEmail: { type: String, required: true },
    orderId: { type: String, required: true, unique: true },
    requestType: { type: String, required: true },
    reason: { type: String, required: true },
    products: { type: [Schema.Types.Mixed], required: true },
    status: { type: String, required: true, default: "pending" },
  },
  { timestamps: true }
);

const virtualId = ReturnSchema.virtual("id");
virtualId.get(function () {
  return this._id;
});

ReturnSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Return = mongoose.model("Return", ReturnSchema);
