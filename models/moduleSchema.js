const mongoose = require("mongoose");

const ModuleSchema = new mongoose.Schema({
    gradeLevel: {
        type: String
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
});
module.exports = mongoose.model("Module", ModuleSchema);
