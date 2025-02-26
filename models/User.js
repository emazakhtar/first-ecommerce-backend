const { Schema } = require("mongoose");
const mongoose = require("mongoose");

// Clear the model cache if the model already exists
if (mongoose.connection.models["User"]) {
  delete mongoose.connection.models["User"];
}
const userSchema = new Schema(
  {
    googleId: { type: String, unique: true, sparse: true }, // Add Google ID
    email: { type: String, required: true, unique: true },
    name: { type: String },
    password: {
      type: Buffer,
      required: function () {
        return !this.googleId;
      },
    },
    resetToken: { type: String },
    role: { type: String, required: true, default: "user" },
    address: { type: [Schema.Types.Mixed] },
    orders: { type: [Schema.Types.Mixed] },
    salt: { type: Buffer },
  },
  { timestamps: true }
);

const virtualId = userSchema.virtual("id");
virtualId.get(function () {
  return this._id;
});

userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.User = mongoose.model("User", userSchema);
