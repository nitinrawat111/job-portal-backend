import winston from 'winston';

// Setting different logging levels based on environment
let logLevel;
if (process.env.NODE_ENV == 'production')
    logLevel = process.env.PRODUCTION_LOG_LEVEL || 'warn';
else if (process.env.NODE_ENV == 'test')
    logLevel = process.env.TEST_LOG_LEVEL || 'warn';
else if (process.env.NODE_ENV == 'development')
    logLevel = process.env.DEV_LOG_LEVEL || 'silly';
else
    logLevel = process.env.DEV_LOG_LEVEL || 'silly';    // If NODE_ENV is not defined

// Defining logging format
const consoleLogFormat = winston.format.printf(({ level, message, label, timestamp }) => {
    return `${level}: ${message}\n------------------------------------------------------------------------`;
});

// Activity logger
export const logger = winston.createLogger({
    level: logLevel,
    transports: [
        // File transport only for error logs
        new winston.transports.File({
            filename: './logs/error.log',
            level: 'error',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        }),

        // File transports for all logs <= level
        new winston.transports.File({
            filename: './logs/activity.log',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        }),
        
        // Console transports for all logs <= level
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
                consoleLogFormat
            )
        })
    ]
});