const mongoose = require("mongoose");

const qrSessionSchema = new mongoose.Schema(

  {

    token: {
      type: String,
      required: true,
      unique: true
    },

    date: {
      type: Date,
      default: Date.now
    },

    expiresAt: {
      type: Date,
      required: true
    },

    active: {
      type: Boolean,
      default: true
    }

  },

  {
    timestamps: true
  }

);

module.exports = mongoose.model(
  "QRSession",
  qrSessionSchema
);