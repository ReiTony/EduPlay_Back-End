const Achievement = require("../models/achievementSchema");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const getAchievements = async (req, res, next) => {
  try {
    const studentId = req.params.userId;
    const achievements = await Achievement.findOne({ studentId })
      .sort({ createdAt: -1 })
      .limit(10);

    console.log(`Achievements:`, achievements);

    if (achievements.length === 0) {
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
