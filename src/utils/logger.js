import winston from 'winston';

// Setting different logging levels based on environment
let consoleLogLevel;
if (process.env.NODE_ENV == 'production')
    consoleLogLevel = process.env.PRODUCTION_LOG_LEVEL || 'info';
else if (process.env.NODE_ENV == 'test')
    consoleLogLevel = process.env.TEST_LOG_LEVEL || 'warn';
else if (process.env.NODE_ENV == 'development')
    consoleLogLevel = process.env.DEV_LOG_LEVEL || 'silly';
else
    consoleLogLevel = process.env.DEV_LOG_LEVEL || 'silly';    // If NODE_ENV is not defined, consider it as Development Environment

// Defining console logging format
const consoleLogFormat = winston.format.printf(({ level, message, label, timestamp }) => {
    return `${level}: ${message}\n------------------------------------------------------------------------`;
});

// Activity logger
export const logger = winston.createLogger({
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

        // File transports for all logs <= info
        new winston.transports.File({
            filename: './logs/activity.log',
            level: 'http',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        }),
        
        // Console transports for all logs <= consoleLogLevel
        new winston.transports.Console({
            level: consoleLogLevel,
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
                consoleLogFormat
            )
        })
    ]
});