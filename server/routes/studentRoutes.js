const express = require("express");
const router = express.Router();


const upload = require("../config/upload");

const authMiddleware = require("../middleware/authMiddleware");



const {

    createStudent,

    getAllStudents,

    deleteStudent,

    uploadFaceImage

} = require("../controllers/studentController");




// ============================
// Protect Student Routes
// ============================
router.use(authMiddleware);




// ============================
// Create Student
// ============================
router.post(
    "/",
    createStudent
);




// ============================
// Get Logged-in User Students
// ============================
router.get(
    "/",
    getAllStudents
);




// ============================
// Delete Student
// ============================
router.delete(
    "/:id",
    deleteStudent
);




// ============================
// Upload Face Image
// ============================
router.post(

    "/upload/:id",

    upload.single("faceImage"),

    uploadFaceImage

);



module.exports = router;