const { Schema } = require("mongoose");
const mongoose = require("mongoose");

// Clear the model cache if the model already exists
if (mongoose.connection.models["Brand"]) {
  delete mongoose.connection.models["Brand"];
}

const brandSchema = new Schema({
  value: { type: String, required: true, unique: true },
  label: { type: String, required: true, unique: true },
});

const virtualId = brandSchema.virtual("id");
virtualId.get(function () {
  return this._id;
});

brandSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Brand = mongoose.model("Brand", brandSchema);
