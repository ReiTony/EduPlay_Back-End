const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const StudentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please provide first name"],
      minlength: 3,
      maxlength: 15,
    },
    lastName: {
      type: String,
      required: [true, "Please provide last name"],
      minlength: 3,
      maxlength: 15,
    },
    birthMonth: {
      type: Number,
      required: [true, "Please provide birth month"],
      minlength: 2,
    },
    birthDay: {
      type: Number,
      required: [true, "Please provide birth day"],
      minlength: 2,
    },
    username: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      minlength: 4,
    },
    role: {
      type: String,
      default: "Student",
    },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/diverse/image/upload/v1674562453/diverse/oipm1ecb1yudf9eln7az.jpg",
    },
    gradeLevel: {
      type: Number,
      enum: [1, 2, 3],
      required: true,
    },
    verificationToken: String,
    verified: Date,
    passwordToken: {
      type: String,
    },
    passwordTokenExpirationDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);


StudentSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

StudentSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("Student", StudentSchema);
