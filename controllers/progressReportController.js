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
    const { username } = req.params;

    const student = await Student.findOne({ username });

    if (!student) {
      throw new CustomError.NotFoundError("Student not found");
    }

    if (!student.isActive) {
      return res
        .status(StatusCodes.OK)
        .json({ message: "Student account is disabled" });
    }

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

module.exports = {
  getProgressReports,
  getProgressReportByStudent,
  updateProgressReport,
};
