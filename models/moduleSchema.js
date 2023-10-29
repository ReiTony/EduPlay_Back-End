const mongoose = require("mongoose");

const ModuleSchema = new mongoose.Schema(
  {
    moduleId: {
      type: Number,
      unique: true,
    },
    gradeLevel: {
      type: String,
      enum: ["1", "2", "3"],
      required: true,
    },
    date: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Module", ModuleSchema);
