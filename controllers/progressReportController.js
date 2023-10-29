const ProgressReport = require("../models/ProgressReportSchema");
const Module = require("../models/ModuleSchema");
const Assessment = require("../models/assessmentSchema");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const createProgressReport = async (req, res) => {
  try {
    const { username, moduleId, moduleProgress, assessmentScores } = req.body;

    // Find the module and assessments by their IDs
    const module = await Module.findOne({ moduleId: moduleId });

    if (!module) {
      throw new CustomError.NotFoundError("Module not found");
    }

    // Map the assessment scores to include the assessment reference
    const assessmentScoresWithRefs = [];
    for (const score of assessmentScores) {
      const assessment = await Assessment.findOne({ assessmentId: score.assessmentId });
      if (!assessment) {
        throw new CustomError.NotFoundError("Assessment not found");
      }
      assessmentScoresWithRefs.push({
        assessmentId: assessment,
        score: score.score,
      });
    }

    // Create a new progress report
    const newProgressReport = new ProgressReport({
      username,
      moduleId: module,
      moduleProgress,
      assessmentScores: assessmentScoresWithRefs,
    });

    await newProgressReport.save();

    res.status(StatusCodes.CREATED).json({
      message: "Progress report created successfully",
      progressReport: newProgressReport,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "An error occurred while processing your request.",
    });
  }
};

const getProgressReports = async (req, res) => {
  try {
    // Retrieve all progress reports
    const progressReports = await ProgressReport.find();

    res.status(StatusCodes.OK).json({ progressReports });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "An error occurred while processing your request.",
    });
  }
};

const getProgressReportById = async (req, res) => {
  try {
    const progressReportId = req.params._id;

    // Find a progress report by ID
    const progressReport = await ProgressReport.findById(progressReportId);

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
    const { moduleProgress, assessmentScores } = req.body;

    // Find and update a progress report by ID
    const progressReport = await ProgressReport.findByIdAndUpdate(
      progressReportId,
      {
        moduleProgress,
        assessmentScores,
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
  createProgressReport,
  getProgressReports,
  getProgressReportById,
  updateProgressReport,
};
