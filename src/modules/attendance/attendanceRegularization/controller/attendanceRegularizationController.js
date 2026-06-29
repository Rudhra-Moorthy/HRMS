const attendanceRegularizationService = require('../service/attendanceRegularizationService');

const createRequest = async (req, res) => {

    try{

        const {

            attendance_id,
            employee_id,
            regularization_date,
            request_type,
            reason

        } = req.body;

        if(

            !attendance_id ||
            !employee_id ||
            !regularization_date ||
            !request_type ||
            !reason

        ){

            return res.status(400).json({

                success:false,
                message:"Required fields are missing"

            });

        }

        const data = await attendanceRegularizationService.createRequest(req.body);

        return res.status(201).json({

            success:true,
            message:"Attendance regularization request submitted successfully",
            data

        });

    }

    catch(err){

        return res.status(500).json({

            success:false,
            message:err.message

        });

    }

};

const getAllRequests = async(req,res)=>{

    try{

        const data = await attendanceRegularizationService.getAllRequests();

        return res.status(200).json({

            success:true,
            data

        });

    }

    catch(err){

        return res.status(500).json({

            success:false,
            message:err.message

        });

    }

};

const getRequestById = async(req,res)=>{

    try{

        const data = await attendanceRegularizationService.getRequestById(req.params.id);

        if(!data){

            return res.status(404).json({

                success:false,
                message:"Request not found"

            });

        }

        return res.status(200).json({

            success:true,
            data

        });

    }

    catch(err){

        return res.status(500).json({

            success:false,
            message:err.message

        });

    }

};

const approveRequest = async(req,res)=>{

    try{

        const { approved_by } = req.body;

        const data = await attendanceRegularizationService.approveRequest(

            req.params.id,

            approved_by

        );

        if(!data){

            return res.status(404).json({

                success:false,
                message:"Request not found"

            });

        }

        return res.status(200).json({

            success:true,
            message:"Attendance request approved successfully",
            data

        });

    }

    catch(err){

        return res.status(500).json({

            success:false,
            message:err.message

        });

    }

};

const rejectRequest = async(req,res)=>{

    try{

        const { rejected_reason } = req.body;

        const data = await attendanceRegularizationService.rejectRequest(

            req.params.id,

            rejected_reason

        );

        if(!data){

            return res.status(404).json({

                success:false,
                message:"Request not found"

            });

        }

        return res.status(200).json({

            success:true,
            message:"Attendance request rejected",
            data

        });

    }

    catch(err){

        return res.status(500).json({

            success:false,
            message:err.message

        });

    }

};

module.exports={

    createRequest,
    getAllRequests,
    getRequestById,
    approveRequest,
    rejectRequest

};