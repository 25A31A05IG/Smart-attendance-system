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


    // Owner of this student
    createdBy: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true

    }


},
{
    timestamps:true
});


// Roll number should be unique only for each teacher
studentSchema.index(
    {
        rollNumber:1,
        createdBy:1
    },
    {
        unique:true
    }
);


module.exports = mongoose.model(
    "Student",
    studentSchema
);