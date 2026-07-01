const { createAttendanceRegularizationHistorySchema } = require('../dto/createAttendanceRegularizationHistory.dto');

const validateHistory = (req, res, next) => {

    const { error } = createAttendanceRegularizationHistorySchema.validate(req.body);

    if(error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    next();
}

module.exports = { validateHistory };