const express = require("express");

const router = express.Router();


const {

    addWorkingDays,

    getWorkingDays

} = require("../controllers/workingDayController");



router.post("/", addWorkingDays);


router.get("/", getWorkingDays);



module.exports = router;