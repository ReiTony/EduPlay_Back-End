const Assessment = require("../models/assessmentSchema");
const Notification = require("../models/notificationSchema");
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

    // Create notification
    const notificationMessage = `A new custom assessment named "${title}" has been uploaded to your learning group`;
    const notification = new Notification({
      message: notificationMessage,
      assessment: newAssessment._id,
      gradeLevel,
    });
    await notification.save();

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
    else assessments = await Assessment.find();
    res.status(StatusCodes.OK).json(assessments);
  } catch (error) {
    console.error(error);
    throw new CustomError.InternalServerError("Failed to fetch assessments");
  }
};

const getAssessmentsGradeLevel = async (req, res) => {
  try {
    const assessments = await Assessment.find({ gradeLevel: req.params.id });

    if (assessments.length === 0) { // Check if any assessments were found
      throw new CustomError.NotFoundError(
        `No assessments with gradeLevel: ${req.params.id}`
      );
    }

    res.status(StatusCodes.OK).json({ assessments }); // Return assessments as an array
  } catch (error) {
    console.error(error);
    if (error instanceof CustomError.NotFoundError) {
      res.status(StatusCodes.NOT_FOUND).json({ error: error.message });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to fetch assessments" });
    }
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
  getAssessmentsGradeLevel,
  getAllAssessments,
  getSingleAssessment,
  updateAssessment,
  deleteAssessment,
};
