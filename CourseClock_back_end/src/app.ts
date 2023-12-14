import dotenv from 'dotenv';
import express from 'express';
import connectDB from './db/connect';
import cors from 'cors';
import appRouter from './routes/routes';
import getLogger from './middlewares/logger';
import swaggerDocs from './utils/swagger';
import mongoSanitize from 'express-mongo-sanitize'
import {xss} from 'express-xss-sanitizer'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import credentials from './middlewares/credential';
import corsOptions from './config/corsOption';

dotenv.config();

// Constants
const app = express();
const port = process.env.PORT || 5000;
const logger = getLogger('Server');

// Middleware
/**
 * @description Basic security middleware
 */
app.use(helmet());
app.use(credentials);
app.use(cors(corsOptions));
app.use(xss());
app.use(mongoSanitize());

/**
 * @description Basic parser middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//swagger
swaggerDocs(app, port, logger);

// Routes
app.use(appRouter);


const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI ?? 'mongodb://localhost/27017');
    logger.print('✅ Connected to database');
    app.listen(port, () =>
      logger.print(`✅ Server is listening on port ${port}`)
    );
  } catch (error) {
    logger.print(`❌ Error on server startup: ${error}`);
  }
};

start();

