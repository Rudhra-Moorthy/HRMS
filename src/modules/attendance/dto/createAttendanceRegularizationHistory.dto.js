const Joi = require('joi');

const createAttendanceRegularizationHistorySchema = Joi.object(
    {
        regularizationId: Joi.number().integer().required(),
        employeeId: Joi.number().integer().required(),
        action: Joi.string().valid('SUBMITTED', 'APPROVED', 'REJECTED', 'UPDATED', 'DELETED').required(),
        actionBy: Joi.number().integer().required(),
        remarks: Joi.string().allow("", null),
        oldStatus: Joi.string().allow("", null),
        newStatus: Joi.string().allow("", null)
    }
)

module.exports = {
    createAttendanceRegularizationHistorySchema
}