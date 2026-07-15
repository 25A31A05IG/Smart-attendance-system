const express = require("express");
const router = express.Router();


const authMiddleware = require("../middleware/authMiddleware");


const {

    markAttendance,

    bulkMarkAttendance,

    markQRAttendance,

    getAttendance,

    getStudentAttendance,

    getAttendanceHistory,

    getAttendanceByDate

} = require("../controllers/attendanceController");



// Protect all attendance routes
router.use(authMiddleware);




// ============================
// Manual Attendance
// ============================
router.post("/", markAttendance);




// ============================
// Bulk Manual Attendance
// ============================
router.post("/bulk", bulkMarkAttendance);




// ============================
// QR Attendance
// ============================
router.post("/qr", markQRAttendance);




// ============================
// All Attendance Records
// ============================
router.get("/", getAttendance);




// ============================
// Day Wise Attendance History
// ============================
router.get("/history", getAttendanceHistory);




// ============================
// Attendance Details By Date
// ============================
router.get("/history/:date", getAttendanceByDate);




// ============================
// Student Attendance Report
// ============================
router.get(
    "/student/:rollNumber",
    getStudentAttendance
);



module.exports = router;