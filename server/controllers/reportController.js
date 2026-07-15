const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const WorkingDay = require("../models/WorkingDay");



// Get Student Attendance Report

const getStudentReport = async (req, res) => {

    try {


        const { rollNumber } = req.params;



        // Find student

        const student = await Student.findOne({
            rollNumber
        });



        if (!student) {

            return res.status(404).json({

                success:false,

                message:"Student not found"

            });

        }





        // Get attendance history

        const attendance = await Attendance.find({

            student: student._id

        })
        .sort({
            date:-1
        });






        // Get total working days

        const workingDays = await WorkingDay.findOne()
            .sort({
                createdAt:-1
            });





        const totalWorkingDays =
            workingDays ? workingDays.totalDays : 0;







        // Calculate present and absent days

        const presentDays = attendance.filter(

            (record)=>record.status==="Present"

        ).length;





        const absentDays = attendance.filter(

            (record)=>record.status==="Absent"

        ).length;







        // Calculate percentage

        let percentage = 0;



        if(totalWorkingDays > 0){


            percentage = (

                (presentDays / totalWorkingDays) * 100

            ).toFixed(2);


        }








        res.status(200).json({


            success:true,



            data:{


                student,



                attendance:{


                    totalWorkingDays,


                    presentDays,


                    absentDays,


                    percentage


                },



                // Complete attendance history

                attendanceHistory: attendance



            }



        });





    }
    catch(error){


        res.status(500).json({


            success:false,


            message:error.message


        });


    }


};





module.exports = {


    getStudentReport


};