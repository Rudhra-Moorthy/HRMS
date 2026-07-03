const employeeService = require('../service/employeeService');
const createEmployeeDTO = require('../dto/createEmployeeDto');

// Create Employee
const createEmployee = async (req, res) => {

    try {

        const dto = createEmployeeDTO(req.body);
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

    try {

        const result = await employeeService.getEmployees(req.query);

        return res.status(200).json({
            success: true,
            message: 'Employees have been fetched successfully',
            data: result
        });

    } catch (err) {

        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }

}

const getEmployee = async (req, res) => {

    try {

        const result = await employeeService.getEmployee(req.params.id);

        return res.status(200).json({
            success: true,
            message: 'Employee has been fetched successfully',
            data: result
        });

    } catch (err) {

        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });

    }

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