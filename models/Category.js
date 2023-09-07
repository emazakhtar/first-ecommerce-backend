const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const categorySchema = new Schema({
  value: { type: String, required: true, unique: true },
  label: { type: String, required: true, unique: true },
});

const virtualId = categorySchema.virtual("id");
virtualId.get(function () {
  return this._id;
});

categorySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});
exports.Category = mongoose.model("Category", categorySchema);
