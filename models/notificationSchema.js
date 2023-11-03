const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  assessment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assessment",
  },
  gradeLevel: {
    type: Number,
    enum: [1, 2, 3],
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Notification", NotificationSchema);
