const Student = require("../models/Student");

// ============================
// Create Student
// ============================
const createStudent = async (req, res) => {
  try {
    const student = new Student({
      ...req.body,
      createdBy: req.user.id,
    });

    await student.save();

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// Get Logged-in User Students
// ============================
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({
      createdBy: req.user.id,
    });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// Delete Student
// ============================
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// Upload / Register Face Image
// ============================
const uploadFaceImage = async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Check image
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Face image is required",
      });
    }

    // Check face embedding
    if (!req.body.faceEmbedding) {
      return res.status(400).json({
        success: false,
        message: "Face embedding is required",
      });
    }

    let faceEmbedding;

    try {
      faceEmbedding = JSON.parse(req.body.faceEmbedding);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid face embedding",
      });
    }

    if (
      !Array.isArray(faceEmbedding) ||
      faceEmbedding.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid face embedding",
      });
    }

    // Save image filename
    student.faceImage = req.file.filename;

    // Save face descriptor
    student.faceEmbedding = faceEmbedding;

    await student.save();

    res.status(200).json({
      success: true,
      message: "Face registered successfully",
      data: student,
    });
  } catch (error) {
    console.error("Face upload error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  deleteStudent,
  uploadFaceImage,
};
