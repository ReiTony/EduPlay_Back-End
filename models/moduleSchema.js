const mongoose = require("mongoose");

const ModuleSchema = new mongoose.Schema(
  {
    moduleNumber: {
      type: Number,
      unique: true,
    },
    order: {
      type: Number,
      required: true,
    },
    gradeLevel: {
      type: String,
      enum: ["1", "2", "3"],
      required: true,
    },
    date: {
      type: Date,
    },
    filePath: {
      type: String, 
      required: true, 
    },
    type: {
      type: String,
      enum: ["video", "assessment", "ppt", "game"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Module", ModuleSchema);
