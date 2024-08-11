import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import { logger } from '../utils/logger.js';

export const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        logger.info('Connected to MongoDB succesfully!');
        logger.info(`MongoDB Host: ${connectionInstance.connection.host}`);
        logger.info(`DB Name: ${connectionInstance.connection.name}`);
        mongoose.connection.on('error', (err) => {
            logger.error(`Error in MongoDB Connection: ${err}`);
            process.exit(1);
        })
    } catch (err) {
        logger.error(`Cannot connect to MongoDB Database: ${err}`);
        process.exit(1);
    }
};