const Assessment = require("../models/Assessment");
const ProgressReport = require("../models/ProgressReport");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const createAssessment = async (req, res) => {
  try {
    const { questions, answers, gradeLevel } = req.body;

    const newAssessment = new Assessment({
      questions,
      answers,
      gradeLevel,
    });

    await newAssessment.save();

    res.status(StatusCodes.CREATED).json({
      msg: "Success! Assessment Created",
    });
  } catch (error) {
    console.error(error);
    throw new CustomError.InternalServerError("Failed to create assessment");
  }
};

const getAllAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find();
    res.status(StatusCodes.OK).json({ assessments });
  } catch (error) {
    console.error(error);
    throw new CustomError.InternalServerError("Failed to fetch assessments");
  }
};

const getSingleAssessment = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const assessment = await Assessment.findById(assessmentId);

    if (!assessment) {
      throw new CustomError.NotFoundError(
        `No assessment with ID: ${assessmentId}`
      );
    }

    res.status(StatusCodes.OK).json({ assessment });
  } catch (error) {
    console.error(error);
    if (error instanceof CustomError.NotFoundError) {
      throw error;
    } else {
      throw new CustomError.InternalServerError("Failed to fetch assessment");
    }
  }
};

const updateAssessment = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const { questions, answers, gradeLevel } = req.body;

    const updatedAssessment = await Assessment.findByIdAndUpdate(
      assessmentId,
      {
        questions,
        answers,
        gradeLevel,
      },
      { new: true }
    );

    if (!updatedAssessment) {
      throw new CustomError.NotFoundError(
        `No assessment with ID: ${assessmentId}`
      );
    }

    res.status(StatusCodes.OK).json({ assessment: updatedAssessment });
  } catch (error) {
    console.error(error);
    if (error instanceof CustomError.NotFoundError) {
      throw error;
    } else {
      throw new CustomError.InternalServerError("Failed to update assessment");
    }
  }
};

const deleteAssessment = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const deletedAssessment = await Assessment.findByIdAndDelete(assessmentId);

    if (!deletedAssessment) {
      throw new CustomError.NotFoundError(
        `No assessment with ID: ${assessmentId}`
      );
    }

    res
      .status(StatusCodes.OK)
      .json({ message: "Assessment deleted successfully" });
  } catch (error) {
    console.error(error);
    if (error instanceof CustomError.NotFoundError) {
      throw error;
    } else {
      throw new CustomError.InternalServerError("Failed to delete assessment");
    }
  }
};

const recordAssessmentScore = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const { studentUsername, score } = req.body;

    const assessment = await Assessment.findById(assessmentId);

    if (!assessment) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Assessment not found" });
    }

    // Find or create the associated Progress Report based on studentUsername
    let progressReport = await ProgressReport.findOne({ studentUsername });

    if (!progressReport) {
      // If a progress report doesn't exist for the student, create a new one
      progressReport = new ProgressReport({
        studentUsername,
      });
    }

    // Add the assessment score to the Progress Report
    progressReport.assessmentScores.push({
      assessmentId,
      score,
    });

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

module.exports = {
  createAssessment,
  getAllAssessments,
  getSingleAssessment,
  updateAssessment,
  deleteAssessment,
  recordAssessmentScore,
};
