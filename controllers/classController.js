const Token = require('../models/tokenSchema')
const Student = require('../models/studentSchema')
const Teacher = require('../models/teacherSchema')
const Class = require('../models/classSchema')
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const getAllClass = async (req, res) => {
        let students = await Student.find({ studentGradeLevel: req.params.id })
        if (students.length > 0) {
            let modifiedStudents = students.map((student) => {
                return { ...student._doc, password: undefined };
            });
            res.send(modifiedStudents);
        } else {
            res.send({ message: "No students found" });
        }
}
