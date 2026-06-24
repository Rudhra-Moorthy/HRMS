const SalaryDTO = (salary) => {

    return {
        basicPay = salary.basicPay || 0,
        hra = salary.hra || 0,
        medical = salary.medical || 0,
        conveyance = salary.conveyance || 0,
        specialAllowances = salary.specialAllowances || 0,
        advanceBonus = salary.advanceBonus || 0,
        companyPf = salary.companyPf || 0,
        aplc = salary.aplc || 0,
        employeePf = salary.employeePf || 0,
        esi = salary.esi || 0,
        professionalTax = salary.professionalTax || 0
    };

}

module.exports = SalaryDTO;