
# Course Clock Backend

A Backend Implimenation of Umass CS320 Fall 2023 of Group 3.


## Getting Started

Install dependency with npm

```bash
  npm install 
```
Run development sever with npm
```bash
  npm run dev
```
Run built sever with npm
```bash
  npm run build
  npm run start
```

## Dependencies

This project uses several dependencies. Below is a list along with links for more information on each one:

- **bcrypt** - A library to help you hash passwords. [More Info](https://www.npmjs.com/package/bcrypt)
- **cookie-parser** - Parse Cookie header and populate `req.cookies` with an object keyed by the cookie names. [More Info](https://www.npmjs.com/package/cookie-parser)
- **cors** - A node.js package for providing a Connect/Express middleware that can be used to enable CORS. [More Info](https://www.npmjs.com/package/cors)
- **dotenv** - Dotenv is a zero-dependency module that loads environment variables from a `.env` file into `process.env`. [More Info](https://www.npmjs.com/package/dotenv)
- **express** - Fast, unopinionated, minimalist web framework for Node.js. [More Info](https://www.npmjs.com/package/express)
- **express-mongo-sanitize** - Sanitize request data against query selector injection attacks. [More Info](https://www.npmjs.com/package/express-mongo-sanitize)
- **express-xss-sanitizer** - Middleware to sanitize user input coming from POST body, GET queries, and url params. [More Info](https://www.npmjs.com/package/express-xss-sanitizer)
- **helmet** - Helmet helps you secure your Express apps by setting various HTTP headers. [More Info](https://www.npmjs.com/package/helmet)
- **jsonwebtoken** - An implementation of JSON Web Tokens. [More Info](https://www.npmjs.com/package/jsonwebtoken)
- **mongoose** - Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. [More Info](https://www.npmjs.com/package/mongoose)
- **swagger-jsdoc** - Integrates Swagger using JSDoc comments in your code for API documentation. [More Info](https://www.npmjs.com/package/swagger-jsdoc)
- **swagger-ui-express** - This module allows you to serve auto-generated swagger-ui generated API docs from express, based on a `swagger.json` file. [More Info](https://www.npmjs.com/package/swagger-ui-express)
- **ts-node** - TypeScript execution environment and REPL for Node.js, with source map support. [More Info](https://www.npmjs.com/package/ts-node)
- **winston** - A logger for just about everything in Node.js. [More Info](https://www.npmjs.com/package/winston)

Each of these packages can be installed via npm. For more detailed instructions, refer to the respective package documentation.
## API Documentation

Once the server is running, you can access the API documentation by navigating to:

http://localhost:PORT/api-docs


Replace `PORT` with the actual port number on which your server is running. Typically, this might be `8080` or another port you have configured. The documentation is generated using `swagger-ui-express` and `swagger-jsdoc`, providing a comprehensive and interactive documentation of your API's endpoints, parameters, and responses.

