const Student = require("../models/Student");

// ==================================================
// Create Student
// ==================================================

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
    console.error(
      "CREATE STUDENT ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================================================
// Get Students
// ==================================================

const getAllStudents = async (
  req,
  res
) => {
  try {
    const students =
      await Student.find({
        createdBy: req.user.id,
      });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error(
      "GET STUDENTS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================================================
// Delete Student
// ==================================================

const deleteStudent = async (
  req,
  res
) => {
  try {
    const student =
      await Student.findOneAndDelete({
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
      message:
        "Student deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE STUDENT ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================================================
// Upload / Register Face
// ==================================================

const uploadFaceImage = async (
  req,
  res
) => {
  try {
    console.log(
      "========== FACE REGISTRATION =========="
    );

    console.log(
      "Student ID:",
      req.params.id
    );

    console.log(
      "User ID:",
      req.user?.id
    );

    console.log(
      "File:",
      req.file
    );

    console.log(
      "Body:",
      req.body
    );

    // ==========================================
    // Authentication check
    // ==========================================

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });
    }

    // ==========================================
    // File check
    // ==========================================

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Face image was not received",
      });
    }

    // ==========================================
    // Embedding check
    // ==========================================

    if (!req.body.faceEmbedding) {
      return res.status(400).json({
        success: false,
        message:
          "Face embedding was not received",
      });
    }

    // ==========================================
    // Find Student
    // ==========================================

    const student =
      await Student.findOne({
        _id: req.params.id,
        createdBy: req.user.id,
      });

    if (!student) {
      return res.status(404).json({
        success: false,
        message:
          "Student not found",
      });
    }

    // ==========================================
    // Parse Face Embedding
    // ==========================================

    let faceEmbedding;

    try {
      faceEmbedding =
        JSON.parse(
          req.body.faceEmbedding
        );
    } catch (error) {
      console.error(
        "JSON PARSE ERROR:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          "Invalid face embedding format",
      });
    }

    // ==========================================
    // Validate Array
    // ==========================================

    if (
      !Array.isArray(
        faceEmbedding
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Face embedding must be an array",
      });
    }

    // ==========================================
    // Validate 128 values
    // ==========================================

    if (
      faceEmbedding.length !== 128
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Face embedding must contain exactly 128 values",
      });
    }

    // ==========================================
    // Validate Numbers
    // ==========================================

    for (
      const value of faceEmbedding
    ) {
      if (
        typeof value !== "number" ||
        !Number.isFinite(value)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid value inside face embedding",
        });
      }
    }

    // ==========================================
    // Save Face Image
    // ==========================================

    student.faceImage =
      req.file.filename;

    // ==========================================
    // Save Face Embedding
    // ==========================================

    student.faceEmbedding =
      faceEmbedding;

    // ==========================================
    // Save to MongoDB
    // ==========================================

    await student.save();

    console.log(
      "FACE REGISTRATION SUCCESS"
    );

    return res.status(200).json({
      success: true,
      message:
        "Face registered successfully",
      data: student,
    });

  } catch (error) {

    console.error(
      "================================"
    );

    console.error(
      "FACE REGISTRATION ERROR"
    );

    console.error(
      "Name:",
      error.name
    );

    console.error(
      "Message:",
      error.message
    );

    console.error(
      "Stack:",
      error.stack
    );

    console.error(
      "================================"
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Face registration failed",
    });
  }
};

// ==================================================
// Exports
// ==================================================

module.exports = {
  createStudent,
  getAllStudents,
  deleteStudent,
  uploadFaceImage,
};
