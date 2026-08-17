const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    rollNumber: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    department: {
      type: String,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    section: {
      type: String,
      required: true,
    },

    faceImage: {
      type: String,
      default: "",
    },

    // ==========================================
    // Face Recognition Descriptor
    // face-api.js = 128 numbers
    // ==========================================

    faceEmbedding: {
      type: [Number],
      default: [],
    },

    // ==========================================
    // Student Owner
    // ==========================================

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

// ==========================================
// Roll number unique per teacher
// ==========================================

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
