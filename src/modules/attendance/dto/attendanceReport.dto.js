const Joi = require('joi');

const attendanceReportSchema = Joi.object(
    {

        month: Joi.number().integer().min(1).max(12).required(),
        year: Joi.number().integer().min(2025).required(),
        departmentId: Joi.number().integer().allow(null),
        employeeId: Joi.number().integer().allow(null),
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
        search: Joi.string().allow("", null)

    }
)
 
module.exports = { attendanceReportSchema };
