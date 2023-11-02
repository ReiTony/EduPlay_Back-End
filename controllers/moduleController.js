const fs = require("fs");

const getStudentModule = async (req, res) => {
  try {
    const { moduleNumber, gradeLevel, type } = req.query;
    if (!moduleNumber || !gradeLevel || !type) return res.status(400).json({ message: "moduleNumber, gradeLevel, and type are required." });
    const data = fs.readFileSync(`./data/modules/grade${gradeLevel}/module${moduleNumber}/${type}.json`, { encoding: "utf-8" });
    if (!data) return res.status(404).json({ message: "Module not found" });
    res.status(200).json({ message: "Success", request: JSON.parse(data) });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

const getSummary = async (req, res) => {
  try {
    const { gradeLevel } = req.query;
    if (!gradeLevel) return res.status(400).json({ message: "gradeLevel is required" });
    const data = fs.readFileSync(`./data/modules/grade${gradeLevel}/summary.json`, { encoding: "utf-8" });
    if (!data) return res.status(404).json({ message: "Summary not found" });
    res.status(200).json({ message: "Success", request: JSON.parse(data) });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStudentModule, getSummary };
