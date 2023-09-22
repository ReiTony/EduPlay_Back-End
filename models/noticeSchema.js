const mongoose = require("mongoose")

const NoticeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model("Notice", NoticeSchema)