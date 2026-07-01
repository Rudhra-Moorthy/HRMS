const Joi = require('joi');

const createAttendanceRegularizationSchema = Joi.object(

    {
        attendanceId: Joi.number()
                        .integer() 
                        .required(),

        requestType: Joi.string()
                    .valid(
                        'CHECK_IN', 
                        'CHECK_OUT', 
                        'BOTH'
                    ).required(),
        
        requestedCheckIn: Joi.date().allow(null),

        requestedChechOut: Joi.date().allow(null),

        reason: Joi.string()
                .trim()
                .min(10)
                .max(500).
                required()
    }

);

const updateAttendanceRegularizationSchema = Joi.object(

    {

        requestType: Joi.string()
                        .valid(
                            'CHECK_IN',
                            'CHECK_OUT',
                            'BOTH'
                        ),

        requestedCheckIn: Joi.date()
                            .allow(null),

        requestedCheckOut: Joi.date().allow(null),

        reason: Joi.string()
                   .trim()
                   .min(10)
                   .max(500)

    }

);

module.exports = {
    createAttendanceRegularizationSchema,
    updateAttendanceRegularizationSchema
}