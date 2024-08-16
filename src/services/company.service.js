import { Company } from '../models/company.model.js';

class CompanyService {
    static Model = Company;
    
    static async register(newCompanyDetails, adminId) {
        const newCompany = new this.Model(newCompanyDetails);
        newCompany.admin = adminId;
        newCompany.recruiters = [adminId];
        await newCompany.save();
    }
}

export default CompanyService;