const Student = require("../models/Student");



// ============================
// Create Student
// ============================
const createStudent = async (req, res) => {

    try {


        const student = new Student({

            ...req.body,

            createdBy: req.user.id

        });



        await student.save();



        res.status(201).json({

            success:true,

            message:"Student created successfully",

            data:student

        });



    } catch(error) {


        res.status(500).json({

            success:false,

            message:error.message

        });


    }

};






// ============================
// Get Logged-in User Students
// ============================
const getAllStudents = async (req,res)=>{


    try{


        const students = await Student.find({

            createdBy:req.user.id

        });



        res.status(200).json({

            success:true,

            count:students.length,

            data:students

        });



    }catch(error){


        res.status(500).json({

            success:false,

            message:error.message

        });


    }


};







// ============================
// Delete Student
// ============================
const deleteStudent = async(req,res)=>{


    try{


        const student = await Student.findOneAndDelete({

            _id:req.params.id,

            createdBy:req.user.id

        });



        if(!student){


            return res.status(404).json({

                success:false,

                message:"Student not found"

            });


        }



        res.status(200).json({

            success:true,

            message:"Student deleted successfully"

        });



    }catch(error){


        res.status(500).json({

            success:false,

            message:error.message

        });


    }


};







// ============================
// Upload Face Image
// ============================
const uploadFaceImage = async(req,res)=>{


    try{


        const student = await Student.findOne({

            _id:req.params.id,

            createdBy:req.user.id

        });



        if(!student){


            return res.status(404).json({

                success:false,

                message:"Student not found"

            });


        }




        student.faceImage = req.file.filename;



        await student.save();




        res.status(200).json({

            success:true,

            message:"Face image uploaded successfully",

            data:student

        });



    }catch(error){


        res.status(500).json({

            success:false,

            message:error.message

        });


    }


};






module.exports = {

    createStudent,

    getAllStudents,

    deleteStudent,

    uploadFaceImage

};