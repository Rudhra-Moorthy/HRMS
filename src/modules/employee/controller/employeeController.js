const employeeService = require('../service/employeeService');
const createEmployeeDTO = require('../dto/createEmployeeDto');

// Create Employee
const createEmployee = async (req, res) => {

    try {

        const dto = createEmployee(req.body);
        const result = await employeeService.createEmployee(dto);

        return res.status(201).json({
            success: true,
            message: "Employee created successfully",
            data: result
        });

    } catch (err) {

        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });
    }

}

const getEmployees = async (req, res) => {

}

const getEmployee = async (req, res) => {

}

const updateEmployee = async (req, res) => {

    try {

        const employee = await employeeService.updateEmployee(req.params.id, req.body);

        return res.status(200).json({
            success: true,
            message: "Employee updated successfully",
            employee
        });

    } catch (err) {

        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }

}

const deleteEmployee = async (req, res) => {

    try {

        await employeeService.deleteEmployee(req.params.id);

        return res.status(200).json({
            suucess: false,
            message: "Employee deleted successfully"
        });

    } catch (err) {

        res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });
        
    }

}



module.exports = {
    createEmployee,
    getEmployees,
    getEmployee,
    updateEmployee,
    deleteEmployee
};