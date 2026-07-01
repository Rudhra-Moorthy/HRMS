const { createAttendanceRegularizationSchema, updateAttendanceRegularizationSchema } = require('../dto/regularization.dto');

const validateCreate = (req, res, next) => {
    
    const { error } = createAttendanceRegularizationSchema.validate(req.body);

    if(error) {
        return res.status(400).json({
            success: true,
            message: error.details[0].message
        });
    }

    next();

}

const validateUpdate = (req, res, next) => {

    const { error } = updateAttendanceRegularizationSchema.validate(req.body);

    if(error) {
        return res.status(400).json({
            success: true,
            message: error.details[0].message
        });
    }

    next();

}

module.exports = {
    validateUpdate,
    validateCreate
};