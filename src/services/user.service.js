import AuthenticationService from './authentication.service.js';
import RegistrationService from './registration.service.js';

// PLEASE DO NOT USE THIS CLASS DIRECTLY. USE APPROPRIATE CHILD CLASSES
class UserService {
    // To be defined in child classes
    static Model = undefined;
    static role = undefined;
    static safeProjection = {
        _id: 0,
        hash: 0,
        __v: 0,
        createdAt: 0,
        updatedAt: 0,
        refreshTokens: 0
    }

    static async register(newUserDetails) {
        await RegistrationService.registerUser(newUserDetails, this);
    }

    static async authenticate(email, password) {
        return await AuthenticationService.authenticateUser(email, password, this);
    }

    static async refreshAuthentication(incomingRefreshToken) {
        return await AuthenticationService.refreshUserAuthentication(incomingRefreshToken, this);
    }

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