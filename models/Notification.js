const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const NotificationSchema = new Schema({
  // Optionally, you can link the notification to a specific resource or user (here resourceId)
  resourceId: { type: String },
  // The notification message that will be displayed to the user.
  message: { type: String, required: true },
  // A flag to indicate if the notification has been read.
  read: { type: Boolean, default: false },
  // Automatically set the creation date to now.
  createdAt: { type: Date, default: Date.now },
});

const virtualId = NotificationSchema.virtual("id");
virtualId.get(function () {
  return this._id;
});

NotificationSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Notification = mongoose.model("Notification", NotificationSchema);
