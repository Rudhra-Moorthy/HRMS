const SalaryDTO = (salary) => {

    return {
        basicPay: salary.basic_pay || 0,
        hra: salary.hra || 0,
        medical: salary.medical || 0,
        conveyance: salary.conveyance || 0,
        specialAllowances: salary.special_allowances || 0,
        advanceBonus: salary.advance_bonus || 0,
        companyPf: salary.company_pf || 0,
        aplc: salary.aplc || 0,
        employeePf: salary.provident_fund || 0,
        esi: salary.esi || 0,
        professionalTax: salary.professional_tax || 0
    };

}

module.exports = SalaryDTO;