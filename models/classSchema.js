const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema({
    gradeLevel: {
        type: String,
        required: true,
        enum: ['1', '2', '3']
    },
});
module.exports = mongoose.model("Class", ClassSchema);
