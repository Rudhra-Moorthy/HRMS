const Joi = require('joi');

const createAttendanceSchema = Joi.object({

    employeeId: Joi.number().integer().required(),
    attendanceDate: Joi.date().required(),
    checkInTime: Joi.date().required(),
    checkOutTime: Joi.date().allow(null),
    location: Joi.string().max(255).allow('', null),
    remarks: Joi.string().max(500).allow('', null)

});

module.exports = {
    createAttendanceSchema
};