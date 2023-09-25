const mongoose = require("mongoose");

const ModuleSchema = new mongoose.Schema(
  {
    gradeLevel: {
      type: String,
      enum: ["1", "2", "3"],
      required: true,
    },
    file_id: {
      type: String,
    },
    file_extension: {
      type: String,
    },
    date: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Module", ModuleSchema);
