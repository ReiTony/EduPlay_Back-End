const fs = require("fs");
const Module = require("../models/moduleSchema");

const storeModule = async (req, res) => {
  try {
    const { order, gradeLevel, date, filePath, type } = req.body;

    const moduleBuffer = fs.readFileSync(filePath);

    const data = moduleBuffer.toString("base64");

    const module = new Module({
      order,
      gradeLevel,
      date,
      filePath,
      type,
      data,
    });

    await module.save();

    res.status(201).json({ message: "Module saved successfully" });
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: "Failed to save module" });
  }
};

module.exports = {
  storeModule,
};