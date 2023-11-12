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

const getModules = async (req, res) => {
  try {
    const modules = await Module.find();

    res.status(200).json({ modules });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve modules" });
  }
};

const getSingleModule = async (req, res) => {
  try {
    const { id } = req.params;

    const module = await Module.findById(id);
    if (!module) {
      return res.status(404).json({ error: "Module not found" });
    }

    const decodedData = Buffer.from(module.data.toString(), 'base64').toString('utf-8');

    res.status(200).json({ ...module.toObject(), data: decodedData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve module" });
  }
};

module.exports = {
  storeModule,
  getModules,
  getSingleModule,
};