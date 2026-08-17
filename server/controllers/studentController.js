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
    console.error("CREATE STUDENT ERROR:");
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================================================
// Get Logged-in User Students
// ==================================================
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({
      createdBy: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error("GET STUDENTS ERROR:");
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================================================
// Delete Student
// ==================================================
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
    console.error("DELETE STUDENT ERROR:");
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================================================
// Upload / Register Face
// ==================================================
const uploadFaceImage = async (req, res) => {
  try {
    console.log("");
    console.log("========================================");
    console.log("FACE REGISTRATION STARTED");
    console.log("========================================");

    // ------------------------------------------
    // Check authenticated user
    // ------------------------------------------

    if (!req.user || !req.user.id) {
      console.log("ERROR: User not authenticated");

      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    console.log("User ID:", req.user.id);

    // ------------------------------------------
    // Check student ID
    // ------------------------------------------

    console.log(
      "Student ID:",
      req.params.id
    );

    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required",
      });
    }

    // ------------------------------------------
    // Check uploaded file
    // ------------------------------------------

    console.log("Uploaded file:");

    if (req.file) {
      console.log({
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
      });
    } else {
      console.log("NO FILE RECEIVED");
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Face image is required",
      });
    }

    // ------------------------------------------
    // Check request body
    // ------------------------------------------

    console.log("Request body:");
    console.log(req.body);

    if (!req.body.faceEmbedding) {
      console.log(
        "ERROR: faceEmbedding not received"
      );

      return res.status(400).json({
        success: false,
        message:
          "Face embedding was not received from frontend",
      });
    }

    // ------------------------------------------
    // Find student
    // ------------------------------------------

    const student = await Student.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!student) {
      console.log("Student not found");

      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    console.log(
      "Student found:",
      student.name
    );

    // ------------------------------------------
    // Parse face embedding
    // ------------------------------------------

    let faceEmbedding;

    try {
      faceEmbedding = JSON.parse(
        req.body.faceEmbedding
      );
    } catch (error) {
      console.error(
        "FACE EMBEDDING JSON ERROR:"
      );

      console.error(error);

      return res.status(400).json({
        success: false,
        message: "Invalid face embedding format",
      });
    }

    // ------------------------------------------
    // Validate embedding
    // ------------------------------------------

    console.log(
      "Embedding type:",
      typeof faceEmbedding
    );

    console.log(
      "Embedding length:",
      faceEmbedding?.length
    );

    if (!Array.isArray(faceEmbedding)) {
      return res.status(400).json({
        success: false,
        message:
          "Face embedding must be an array",
      });
    }

    if (faceEmbedding.length !== 128) {
      return res.status(400).json({
        success: false,
        message:
          `Invalid face embedding. Expected 128 values but received ${faceEmbedding.length}`,
      });
    }

    // ------------------------------------------
    // Validate numbers
    // ------------------------------------------

    const invalidValue =
      faceEmbedding.some(
        (value) =>
          typeof value !== "number" ||
          !Number.isFinite(value)
      );

    if (invalidValue) {
      return res.status(400).json({
        success: false,
        message:
          "Face embedding contains invalid values",
      });
    }

    // ------------------------------------------
    // Save face image
    // ------------------------------------------

    student.faceImage =
      req.file.filename;

    // ------------------------------------------
    // Save face embedding
    // ------------------------------------------

    student.faceEmbedding =
      faceEmbedding;

    // ------------------------------------------
    // Save student
    // ------------------------------------------

    console.log(
      "Saving face registration to MongoDB..."
    );

    await student.save();

    console.log(
      "Face registration saved successfully"
    );

    console.log("========================================");
    console.log("FACE REGISTRATION SUCCESS");
    console.log("========================================");
    console.log("");

    return res.status(200).json({
      success: true,
      message:
        "Face registered successfully",
      data: student,
    });
  } catch (error) {
    console.log("");
    console.error(
      "========================================"
    );
    console.error(
      "FACE REGISTRATION BACKEND ERROR"
    );
    console.error(
      "========================================"
    );

    console.error(
      "Error name:",
      error.name
    );

    console.error(
      "Error message:",
      error.message
    );

    console.error(
      "Full error:",
      error
    );

    console.error(
      "========================================"
    );
    console.log("");

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Face registration failed",
    });
  }
};

// ==================================================
// Export Controllers
// ==================================================
module.exports = {
  createStudent,
  getAllStudents,
  deleteStudent,
  uploadFaceImage,
};
