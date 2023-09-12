const mongoose = require("mongoose");
const UserSchema = require("./userSchema");

const AdminSchema = UserSchema.add({
  role: {
    type: String,
    default: "Admin",
  },
});

module.exports = mongoose.model("Admin", AdminSchema);
