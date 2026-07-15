const express = require("express");

const router = express.Router();


const {
    getStudentReport
} = require("../controllers/reportController");



router.get("/:rollNumber", getStudentReport);



module.exports = router;