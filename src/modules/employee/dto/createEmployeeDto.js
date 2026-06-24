const CreateEmployeeDTO = (employee)=> {

    return {
        employeeCode: employee.employeeCode,
        fullName = employee.fullName,
        email = employee.email,
        phone = employee.phone,
        departmentId = employee.departmentId,
        designationId = employee.designationId,
        joinDate = employee.joinDate,
        salary = employee.salary,
        address = employee.address,
        salaryStructure = employee.salaryStructure
    };
    
}

module.exports = CreateEmployeeDTO;