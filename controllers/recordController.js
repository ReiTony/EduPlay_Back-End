const Assessment = require("../models/assessmentSchema");
const Module = require("../models/moduleSchema");
const GameScore = require("../models/gameScoreSchema");
const ProgressReport = require("../models/progressReportsSchema");
const Achievement = require("../models/achievementSchema");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const recordAssessmentScore = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const { username, score } = req.body;

    const assessment = await Assessment.findById(assessmentId);

    if (!assessment) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Assessment not found" });
    }

    // Find or create the associated Progress Report based on student username
    let progressReport = await ProgressReport.findOne({ username });

    if (!progressReport) {
      progressReport = new ProgressReport({
        username,
      });
    }

    // Add the assessment score to the Progress Report
    progressReport.assessmentScores.push({
      assessment: assessment._id,
      score,
    });

    // Calculate the average score and update it in the Progress Report
    const totalScores = progressReport.assessmentScores.reduce(
      (total, assessment) => total + assessment.score,
      0
    );
    progressReport.averageAssessmentScore =
      totalScores / progressReport.assessmentScores.length;

    await progressReport.save();

    res
      .status(StatusCodes.OK)
      .json({ message: "Assessment score recorded", progressReport });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

const recordGameScore = async (req, res) => {
  try {
    const { username, gameType, score } = req.body;

    if (!gameType) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "gameType is required in the request body.",
      });
    }

    let progressReport = await ProgressReport.findOne({ username });

    if (!progressReport) {
      progressReport = new ProgressReport({
        username,
      });
    }

    const newGameScore = new GameScore({
      gameType,
      score,
    });

    await newGameScore.save();

    progressReport.gameScores.push({
      gameScoreId: newGameScore._id,
      gameType: gameType,
      score: score,
    });

    // Calculate the total game score and update it in the Progress Report
    const totalGameScore = progressReport.gameScores.reduce(
      (total, gameScore) => total + gameScore.score,
      0
    );
    progressReport.totalGameScore = totalGameScore;

    await progressReport.save();

    res.status(StatusCodes.OK).json({
      message: "Game score recorded",
      progressReport,
    });
  } catch (error) {
    console.error("Error:", error);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      specificError: error.message,
    });
  }
};

const recordModule = async (req, res) => {
  try {
    const { student, username, moduleId, title} = req.body;

    const module = await Module.findById(moduleId);

    if (!module) {
      throw new CustomError.NotFoundError("Module not found");
    }

    let progressReport = await ProgressReport.findOne({ username });

    if (!progressReport) {
      progressReport = new ProgressReport({
        username,
      });
    }

    // Check if the module is already in the progress report
    const existingModuleIndex = progressReport.modules.findIndex(
      (module) => module.moduleId.toString() === moduleId.toString()
    );

    if (existingModuleIndex === -1) {
      // If the module is not in the progress report, add it
      progressReport.modules.push({
        moduleId: moduleId,
        is_module_completed: true,
      });

      // You can also check for the next module and unlock it if needed
      const nextModule = await Module.findOne({ order: module.order + 1 });
      if (nextModule && !progressReport.unlockedModules.includes(nextModule._id)) {
        progressReport.unlockedModules.push(nextModule._id);
      }
    } else {
      // If the module is already in the progress report, update its completion status
      progressReport.modules[existingModuleIndex].is_module_completed = true;
    }

    await progressReport.save();

    try {
      const achievement = new Achievement({ student, moduleOrAssessmentTitle: `Module: ${title}`, completed: true });
      await achievement.save();
    } catch (error) {}

    res.status(StatusCodes.OK).json({
      message: "Module progress recorded",
      progressReport,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof CustomError.NotFoundError) {
      throw error;
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal Server Error" });
    }
  }
};

module.exports = {
  recordAssessmentScore,
  recordGameScore,
  recordModule,
};
