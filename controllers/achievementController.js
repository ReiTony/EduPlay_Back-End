const Achievement = require("../models/achievementSchema");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const getAchievements = async (req, res, next) => {
  try {
    const studentId = req.params.userId;
    const achievements = await Achievement.findById(studentId).lean();
    if (!achievements) {
      throw new CustomError.NotFoundError("Achievements not found");
    }
    res.status(StatusCodes.OK).json(achievements);
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getAchievements,
};
