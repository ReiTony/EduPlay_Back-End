const Module = require("../models/moduleSchema");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const fs = require('fs').promises;

async function uploadModules(folderPath) {
  try {
    const files = await fs.readdir(folderPath);

    for (let index = 0; index < files.length; index++) {
      const filename = files[index];
      const filePath = `${folderPath}/${filename}`;
      const data = await fs.readFile(filePath);

      const newModule = new Module({
        order: index + 1,
        gradeLevel: '1',
        date: new Date(),
        filePath,
        type: getTypeFromFilename(filename),
        data,
      });

      await newModule.save();
    }

    console.log('Modules uploaded to the database.');
  } catch (error) {
    console.error(error);
    throw new CustomError('Error uploading modules', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

module.exports = {
  uploadModules,
};
