import {Express, Request, Response} from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import {version} from '../../package.json';
import dotenv from 'dotenv';
import { LoggerModule } from '../middlewares/logger';

const options: swaggerJsDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: '320 Three Back End API',
            version: version,
            description: 'To run all of the api endpoints, you need to login first. You can login by using the login endpoint. After that, you will get a token. You need to put the token in the authorization header. The token will be expired in 30 minutes. You can get the token by using the refresh token endpoint or login endpoint again.',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
        },
        apis: ['./src/routes/*.ts', './src/models/*.ts'],
        
}

const specs = swaggerJsDoc(options);

export default function swaggerDocs(app: Express, port: string | 5000, log: LoggerModule) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    app.get('/api-docs.json', (req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(specs);
    });

    log.print(`✅ Swagger docs available at http://localhost:${port}/api-docs`);
}