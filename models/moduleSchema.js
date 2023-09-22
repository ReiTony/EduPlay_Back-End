const mongoose = require("mongoose");

const ModuleSchema = new mongoose.Schema({
    moduleGradeLevel: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Class',
    },
    file_id: {
        type: String
    },
    file_extension: {
        type: String
    },
    date: {
        type: Date
    }
},{ timestamps: true });

module.exports = mongoose.model("Module", ModuleSchema);
