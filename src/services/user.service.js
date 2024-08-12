class UserService {
    // To be defined in child classes
    static Model = undefined;
    static role = undefined;

    static async findByEmail (email, projection = undefined) {
        return await this.Model.findOne({ email: email }, projection).exec();
    }

    static async findById (_id, projection = undefined) {
        return await this.Model.findOne({ _id: _id}, projection).exec();
    }

    static async addRefreshTokenAndSave (user, refreshToken) {
        user.refreshTokens.push(refreshToken);
        await user.save( { validateBeforeSave: false } );
    }
    
    static async clearRefreshTokensAndSave(user) {
        user.refreshTokens = [];
        await user.save( { validateBeforeSave: false } );
    }
}

export default UserService;