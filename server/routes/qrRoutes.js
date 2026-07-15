const express = require("express");

const router = express.Router();

const {

    generateQR,

    markQRAttendance

} = require("../controllers/qrController");



// Generate QR Code
router.post(
    "/generate",
    generateQR
);



// Student marks attendance
router.post(
    "/mark",
    markQRAttendance
);



module.exports = router;