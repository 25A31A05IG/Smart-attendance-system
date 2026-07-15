const mongoose = require("mongoose");


const workingDaySchema = new mongoose.Schema({

    academicYear: {
        type: String,
        required: true
    },


    totalDays: {
        type: Number,
        required: true
    }


},
{
    timestamps:true
});


module.exports = mongoose.model("WorkingDay", workingDaySchema);