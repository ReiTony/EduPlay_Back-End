const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const TeacherSchema = new mongoose.Schema(
  {
    lrn: {
      type: Number,
      unique: true,
      minlength: 12,
      required: true,
    },
    role: {
      type: String,
      default: "Teacher",
    },
    gradeLevel: {
      type: String,
      enum: ['1','2','3'],
      required: true,
    },
    name: {
      type: String,
      required: [true, "Please provide full name"],
      minlength: 3,
      maxlength: 50,
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
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/diverse/image/upload/v1674562453/diverse/oipm1ecb1yudf9eln7az.jpg",
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
  },
  { timestamps: true }
);

TeacherSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

TeacherSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("Teacher", TeacherSchema);
