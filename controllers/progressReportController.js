const ProgressReport = require("../models/progressReportsSchema");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const getProgressReports = async (req, res) => {
  try {
    const progressReports = await ProgressReport.find();

    res.status(StatusCodes.OK).json({ progressReports });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "An error occurred while processing your request.",
    });
  }
};

const getProgressReportByStudent = async (req, res) => {
  try {
    const { username } = req.params; // Assuming the username is passed as a parameter

    const progressReport = await ProgressReport.findOne({ username });

    if (!progressReport) {
      throw new CustomError.NotFoundError("Progress report not found");
    }

    res.status(StatusCodes.OK).json({ progressReport });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "An error occurred while processing your request.",
    });
  }
};

const updateProgressReport = async (req, res) => {
  try {
    const progressReportId = req.params._id;
    const { moduleProgress, assessmentScores, gameScores } = req.body;

    const progressReport = await ProgressReport.findByIdAndUpdate(
      progressReportId,
      {
        moduleProgress,
        assessmentScores,
        gameScores,
      },
      { new: true }
    );

    if (!progressReport) {
      throw aCustomError.NotFoundError("Progress report not found");
    }

    res.status(StatusCodes.OK).json({ progressReport });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "An error occurred while processing your request.",
    });
  }
};

module.exports = {
  getProgressReports,
  getProgressReportByStudent,
  updateProgressReport,
};
