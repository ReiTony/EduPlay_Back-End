const mongoose = require("mongoose");
const UserSchema = require("./userSchema");

const TeacherSchema = UserSchema.add({
  lrn: {
    type: Number,
    unique: true,
    minlength: 12,
  },
  role: {
    type: String,
    default: "Teacher",
  },
});

module.exports = mongoose.model("Teacher", TeacherSchema);
