const Student = require("../models/Student");
const Attendance = require("../models/Attendance");



// Get Dashboard Data by Date

const getDashboardData = async (req, res) => {

    try {


        const { date } = req.query;



        if (!date) {

            return res.status(400).json({

                success:false,

                message:"Please provide date"

            });

        }




        // Total students

        const totalStudents = await Student.countDocuments();





        // Date range

        const startDate = new Date(date);

        startDate.setHours(0,0,0,0);



        const endDate = new Date(date);

        endDate.setHours(23,59,59,999);







        // Get attendance records

        const attendanceRecords = await Attendance.find({

            date:{

                $gte:startDate,

                $lte:endDate

            }

        })
        .populate("student");







        const present = attendanceRecords.filter(

            (item)=>item.status==="Present"

        ).length;





        const absent = attendanceRecords.filter(

            (item)=>item.status==="Absent"

        ).length;







        let percentage = 0;



        if(totalStudents > 0){


            percentage = (

                (present / totalStudents) * 100

            ).toFixed(2);


        }







        res.status(200).json({


            success:true,



            data:{


                totalStudents,


                present,


                absent,


                percentage,



                records: attendanceRecords



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

    getDashboardData

};