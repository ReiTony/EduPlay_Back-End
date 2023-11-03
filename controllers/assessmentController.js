const Assessment = require("../models/assessmentSchema");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const createAssessment = async (req, res) => {
  try {
    const { title, questions, answers, gradeLevel, moduleNumber } = req.body;

    const newAssessment = new Assessment({
      moduleNumber,
      title,
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
    const { gradeLevel, id } = req.query;
    let assessments = {};
    if (gradeLevel) assessments = await Assessment.find({gradeLevel});
    else if (id) assessments = await Assessment.findById(id);
    res.status(StatusCodes.OK).json(assessments);
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
      throw new CustomError.NotFoundError(`No assessment with ID: ${assessmentId}`);
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
    const { title, questions, answers, gradeLevel } = req.body;

    const updatedAssessment = await Assessment.findByIdAndUpdate(
      assessmentId,
      {
        title,
        questions,
        answers,
        gradeLevel,
      },
      { new: true }
    );

    if (!updatedAssessment) {
      throw new CustomError.NotFoundError(`No assessment with ID: ${assessmentId}`);
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
      throw new CustomError.NotFoundError(`No assessment with ID: ${assessmentId}`);
    }

    res.status(StatusCodes.OK).json({ message: "Assessment deleted successfully" });
  } catch (error) {
    console.error(error);
    if (error instanceof CustomError.NotFoundError) {
      throw error;
    } else {
      throw new CustomError.InternalServerError("Failed to delete assessment");
    }
  }
};

module.exports = {
  createAssessment,
  getAllAssessments,
  getSingleAssessment,
  updateAssessment,
  deleteAssessment,
};
