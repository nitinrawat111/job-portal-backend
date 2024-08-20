import mongoose from 'mongoose';
import { Company } from '../models/company.model.js';
import { ApiError } from '../utils/ApiError.js';

class CompanyService {
    static Model = Company;
    static safeProjection = {
        admin: 0,
        recruiters: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
    }
    
    static async register(newCompanyDetails, adminId) {
        const newCompany = new this.Model(newCompanyDetails);
        newCompany.admin = adminId;
        newCompany.recruiters = [adminId];
        await newCompany.save();
    }

    static async getById(_id) {
        if(!mongoose.isValidObjectId(_id))
            throw new ApiError(400, "Invalid company id");

        const company = await this.Model.findOne({ _id: _id } , this.safeProjection).lean().exec();
        if(!company)
            throw new ApiError(404, "Company id not found");

        return company;
    }
}

export default CompanyService;