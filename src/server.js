import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { logRequest } from './middlewares/logger.middleware.js';
import { connectDB } from './db/db.js';
import { logger } from './utils/logger.js';
import { ApiResponse } from './utils/ApiResponse.js';
import { ApiError } from './utils/ApiError.js';
import mongoose from 'mongoose';
import v1Router from './routes/api/v1/v1.router.js'

////////////////////////////////////////////////////////////
// Config
////////////////////////////////////////////////////////////
dotenv.config(); 

////////////////////////////////////////////////////////////
// Express App Initialization
////////////////////////////////////////////////////////////
const app = express();

////////////////////////////////////////////////////////////
// Middlewares
////////////////////////////////////////////////////////////
app.use(logRequest);
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true   // To allow cookies
}));
app.use(express.json());
app.use(cookieParser());

////////////////////////////////////////////////////////////
// Routes
////////////////////////////////////////////////////////////
app.use('/api/v1', v1Router);

////////////////////////////////////////////////////////////
// Error Handler
////////////////////////////////////////////////////////////
app.use((err, req, res, next) => {
    if(req.headersSent) {
        next(err);
    }

    if (err instanceof ApiError) {
        res.status(err.statusCode).json(new ApiResponse(err.statusCode, err.message, undefined, err.errors));
        logger.debug(err.stack);
    } else if (err instanceof mongoose.Error.ValidationError) {
        // Constructing Errors Object from Mongoose Validation Error
        const errors = {}
        for (const key of Object.keys(err.errors))
            errors[key] = err.errors[key].message;
        res.status(400).json(new ApiResponse(400, err.message, undefined, errors));
        logger.debug(err.stack);
    } else {
        // In case of any other error
        res.status(500).json(new ApiResponse(500, "Internal Server Error!"));
        logger.error(err.stack);
    }
});

////////////////////////////////////////////////////////////
// Server Initialization
////////////////////////////////////////////////////////////
const PORT = process.env.PORT || 3000;
connectDB().then(() => {
    app.listen(PORT, () => {
        logger.info(`Server started on PORT: ${PORT}`);
    });
});

////////////////////////////////////////////////////////////
// Exporting Express app for testing
////////////////////////////////////////////////////////////
export default app;