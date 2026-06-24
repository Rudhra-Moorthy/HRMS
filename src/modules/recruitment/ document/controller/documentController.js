const documentService = require('../service/documentService');

const createDocument = async (req, res) => {

    try {

        const data = await documentService.createDocument(req.body);

        return res.status(201).json({
            success:true,
            message:"Document uploaded successfully",
            data
        });

    } catch (err) {

        return res.status(500).json({
            success:false,
            message:err.message
        });

    }

};


const getAllDocuments = async (req,res)=>{

    try{

        const data = await documentService.getAllDocuments();

        return res.status(200).json({
            success:true,
            data
        });

    }catch(err){

        return res.status(500).json({
            success:false,
            message:err.message
        });

    }

};


const getDocumentById = async (req,res)=>{

    try{

        const data = await documentService.getDocumentById(req.params.id);

        if(!data){

            return res.status(404).json({
                success:false,
                message:"Document not found"
            });

        }

        return res.status(200).json({
            success:true,
            data
        });

    }catch(err){

        return res.status(500).json({
            success:false,
            message:err.message
        });

    }

};


const deleteDocument = async (req,res)=>{

    try{

        const data = await documentService.deleteDocument(req.params.id);

        if(!data){

            return res.status(404).json({
                success:false,
                message:"Document not found"
            });

        }

        return res.status(200).json({
            success:true,
            message:"Document deleted successfully"
        });

    }catch(err){

        return res.status(500).json({
            success:false,
            message:err.message
        });

    }

};

module.exports = {
    createDocument,
    getAllDocuments,
    getDocumentById,
    deleteDocument
};