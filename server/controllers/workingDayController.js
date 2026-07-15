const WorkingDay = require("../models/WorkingDay");



// Add working days

const addWorkingDays = async(req,res)=>{


    try{


        const workingDay = new WorkingDay(req.body);


        await workingDay.save();



        res.status(201).json({

            success:true,

            message:"Working days saved successfully",

            data:workingDay

        });



    }catch(error){


        res.status(500).json({

            success:false,

            message:error.message

        });


    }


};




// Get working days

const getWorkingDays = async(req,res)=>{


    try{


        const workingDays = await WorkingDay.findOne()
        .sort({createdAt:-1});



        res.status(200).json({

            success:true,

            data:workingDays

        });



    }catch(error){


        res.status(500).json({

            success:false,

            message:error.message

        });


    }


};



module.exports = {

    addWorkingDays,

    getWorkingDays

};