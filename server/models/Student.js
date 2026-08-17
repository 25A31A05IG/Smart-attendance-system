const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    // ============================
    // Student Name
    // ============================
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // ============================
    // Roll Number
    // ============================
    rollNumber: {
      type: String,
      required: true,
      trim: true,
    },

    // ============================
    // Email
    // ============================
    email: {
      type: String,
      required: true,
      trim: true,
    },

    // ============================
    // Department
    // ============================
    department: {
      type: String,
      required: true,
      trim: true,
    },

    // ============================
    // Year
    // ============================
    year: {
      type: Number,
      required: true,
    },

    // ============================
    // Section
    // ============================
    section: {
      type: String,
      required: true,
      trim: true,
    },

    // ============================
    // Face Image
    // ============================
    faceImage: {
      type: String,
      default: "",
    },

    // ============================
    // Face Recognition Descriptor
    // face-api.js generates 128 values
    // ============================
    faceEmbedding: {
      type: [Number],
      default: [],
    },

    // ============================
    // Owner of Student
    // ============================
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

// ============================
// Roll number unique per teacher
// ============================
studentSchema.index(
  {
    rollNumber: 1,
    createdBy: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "Student",
  studentSchema
);
