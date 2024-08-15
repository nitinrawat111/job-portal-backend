import { ApiError } from "../utils/ApiError.js";

const authorize = (role) => {
    return (req, res, next) => {
        if(req.userDetails?.role != role)
            throw new ApiError(403, "Forbidden");

        next();
    }
};

export { authorize };