import { logger } from '../utils/logger.js';

// Middleware to log incoming requests
export const logRequest = (req, res, next) => {
    const reqDilutedObject = {
        method: req.method,
        url: req.url,
        body: req.body,
        params: req.params,
        query: req.query,
        cookies: req.cookies
    };
    logger.http(`Incoming Request: ${JSON.stringify(reqDilutedObject, null, 2)}`);
    return next();
}