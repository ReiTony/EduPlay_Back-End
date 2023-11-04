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

const getNotifications = async (req, res) => {
  try {
    const { recipient, gradeLevel } = req.query;
    if (recipient && gradeLevel) {
      const temp1 = await Notification.find({ recipient });
      const temp2 = await Notification.find({ gradeLevel });
      return res.status(200).json({ message: "Success", request: [...temp1, ...temp2] });
    }
    const notifications = await Notification.find({});
    res.status(200).json({ message: "Success", request: notifications });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllNotifications,
  getNotifications,
};
