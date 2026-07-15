const QRSession = require("../models/QRSession");
const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const { v4: uuidv4 } = require("uuid");


// Generate QR
const generateQR = async (req, res) => {
  try {

    const token = uuidv4();

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const session = new QRSession({
      token,
      expiresAt,
      active: true
    });

    await session.save();

    res.status(200).json({
      success: true,
      token
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



// Student marks attendance
const markQRAttendance = async (req, res) => {

  try {

    const { token, rollNumber } = req.body;

    const session = await QRSession.findOne({
      token,
      active: true
    });

    if (!session) {

      return res.status(400).json({
        success: false,
        message: "Invalid QR Code"
      });

    }

    if (new Date() > session.expiresAt) {

      return res.status(400).json({
        success: false,
        message: "QR Code Expired"
      });

    }

    const student = await Student.findOne({
      rollNumber
    });

    if (!student) {

      return res.status(404).json({
        success: false,
        message: "Student not found"
      });

    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const alreadyMarked = await Attendance.findOne({
      student: student._id,
      date: { $gte: today }
    });

    if (alreadyMarked) {

      return res.status(400).json({
        success: false,
        message: "Attendance already marked today"
      });

    }

    const attendance = new Attendance({

      student: student._id,

      status: "Present",

      method: "QR Code"

    });

    await attendance.save();

    res.status(200).json({

      success: true,

      message: "Attendance Marked Successfully",

      student

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};


module.exports = {

  generateQR,

  markQRAttendance

};