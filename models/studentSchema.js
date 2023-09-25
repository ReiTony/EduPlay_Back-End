const mongoose = require("mongoose");
const validator = require("validator");

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
      type: String,
      enum: ['1','2','3'],
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
  },
  { timestamps: true }
);


module.exports = mongoose.model("Student", StudentSchema);
