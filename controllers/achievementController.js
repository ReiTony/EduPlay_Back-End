const Achievement = require("../models/achievementSchema");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const getAchievements = async (req, res, next) => {
  try {
    const studentId = req.params.userId;
    const achievements = await Achievement.find({ studentId, completed: true }).lean();
    if (!achievements || achievements.length === 0) {
      throw new CustomError.NotFoundError("No completed achievements found");
    }

    res.status(StatusCodes.OK).json(achievements);
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getAchievements,
};
