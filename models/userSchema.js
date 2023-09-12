const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide full name"],
    minlength: 3,
    maxlength: 50,
  },
  username: {
    type: String,
    required: [true, "Please provide username"],
    minlength: 3,
    maxlength: 10,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide valid email",
    },
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
  },
  verificationToken: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  verified: Date,
  passwordToken: {
    type: String,
  },
  passwordTokenExpirationDate: {
    type: Date,
  },
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = UserSchema;
