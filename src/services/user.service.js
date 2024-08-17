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

    static async register(newUserDetails) {
        await RegistrationService.registerUser(newUserDetails, this);
    }

    static async authenticate(email, password) {
        return await AuthenticationService.authenticateUser(email, password, this);
    }

    static async refreshAuthentication(incomingRefreshToken) {
        return await AuthenticationService.refreshUserAuthentication(incomingRefreshToken, this);
    }
}

export default UserService;