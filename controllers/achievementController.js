const Achievement = require("../models/achievementSchema");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const getAchievements = async (req, res, next) => {
  try {
    const student = req.params.id;

    const achievements = await Achievement.find({ student, completed: true }).lean();

    res.status(StatusCodes.OK).json(achievements);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAchievements,
};
