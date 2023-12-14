import { createLogger, transports, format } from 'winston';
import dotenv from 'dotenv';
dotenv.config();
const { combine, timestamp, label, printf, colorize , json } = format;

export interface LoggerModule {
    print: (msg: string) => void;
    printRequest: (req: any, res: any, next: any) => void;
    logErrors: (err: any, req: any, res: any, next: any) => void;
}

/**
 * Creates a logger module with customized output and error handling.
 * @param prefix - The prefix to be included in the log messages.
 * @returns The logger module object.
 */
export default (prefix: string): LoggerModule => {
    /**
     * Customizing output for log
     */
    const myFormat = printf(({ level, message, label, timestamp }) => {
        return `${timestamp} [${label}] ${level.toUpperCase()}: ${message}`;
    });

    /**
     * Creating logger with module defined options
     */
    const logger = createLogger({
        format: combine(
            label({ label: prefix }), // Use the prefix defined in the module's import
            timestamp(), // Print time stamp
            myFormat, // Use our customized format
            colorize({
                all: true,
                colors: { info: 'green', error: 'red' }
            }), 
        ),
        transports: [
            new transports.Console(),
            new transports.File({ filename: process.env.LOG_FILE }),
            new transports.File({ filename: process.env.ERROR_LOG_FILE, level: 'error' }) // Output error log in a separate file
        ]
    });

    const logErrors = (err: any, req: any, res: any, next: any) => {
        const { method, originalUrl } = req;
        const statusCode = res.statusCode < 400 ? 500 : res.statusCode; // Default to 500 if status code not set
        
        logger.error(`${method} ${originalUrl} ${statusCode} ${err.message}`);
        if (process.env.NODE_ENV === 'development') {
            console.error(err.stack);
        }
        
        // Forward to default Express error handler if headers already sent
        if (res.headersSent) {
            return next(err);
        }

        res.status(statusCode).json({ error: err.message });
    };

    const module: LoggerModule = {
        print(msg: string) {
            logger.info(`${msg}`); // Outputs a message
        },

        /**
         * This method will be used as middleware for all requests.
         * See routes.js.
         */
        printRequest(req: any, res: any, next: any) {
            const { method, originalUrl, body } = req;

            let msg = `${method} ${originalUrl}`;

            if (Object.keys(body).length > 0) { // If it has body
                msg += ` ${JSON.stringify(body)}`; // Include body in log
            }

            logger.info(msg);

            next();
        },

        /**
         * Log errors
         */
        logErrors
    };

    return module;
}