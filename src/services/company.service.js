import { Company } from '../models/company.model.js';

class CompanyService {
    static Model = Company;
    
    static async register(newCompanyDetails, adminId) {
        newCompanyDetails.admin = adminId;
        newCompanyDetails.recruiters = [adminId];
        const newCompany = new Company(newCompanyDetails);
        await newCompany.save();
    }
}

export default CompanyService;