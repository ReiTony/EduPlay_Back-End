const Notification = require("../models/notificationSchema");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const getAllNotifications = async (req, res) => {
  try {
    const { gradeLevel } = req.params;

    const notifications = await Notification.find({ gradeLevel });

    res.status(StatusCodes.OK).json({ notifications });
  } catch (error) {
    console.error(error);
    throw new CustomError.InternalServerError("Failed to fetch notifications");
  }
};

module.exports = {
  getAllNotifications,
};
