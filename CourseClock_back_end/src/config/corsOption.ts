/**
 * Configuration options for Cross-Origin Resource Sharing (CORS).
 */
import allowedOrigins from './allowedOrigins';

const corsOptions = {
    /**
     * Determines whether the request origin is allowed or not.
     * @param origin - The request origin.
     * @param callback - The callback function to be called with the result.
     */
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
};

export default corsOptions;

