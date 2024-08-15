import JWTService from "../services/jwt.service.js";

const verifyJWT = (req, res, next) => {
    const decoded = JWTService.verifyAccessToken(req.cookies.accessToken);
    req.userDetails = decoded.userDetails;
    next();
};

export { verifyJWT };