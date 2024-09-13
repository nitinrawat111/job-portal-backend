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
        refreshTokens: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0
    }
    
    static async getProfile(_id) {
        return await this.Model.findOne({ _id: _id }, this.safeProjection).lean().exec();
    }

    static async register(newUserDetails) {
        await RegistrationService.register(newUserDetails, this);
    }

    static async authenticate(email, password) {
        return await AuthenticationService.authenticate(email, password, this);
    }

    static async refreshAuthentication(incomingRefreshToken) {
        return await AuthenticationService.refreshAuthentication(incomingRefreshToken, this);
    }
}

export default UserService;