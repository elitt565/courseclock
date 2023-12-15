# CourseClock
## Team Members
- Phong
- Elena
- Neel
- Hanabel
- Kevin
- Aashi
​
## Overview of Code
### Frontend
#### File Structure:
- `src`:
  - `api`: All of the fetch logic is here.
  - `assets`: Stores images that are needed.
  - `components`: Contains reusable objects.
  - `pages`: Each of the pages.
  - `styles`: CSS components of each page.
  - `types`: Type definitions.
  - `App.tsx`: Define router.
  - `index.tsx`: Define Authentication.
​
### Backend
#### File Structure:
- `src`: contains all folders.
  - `config`: Contains the base configuration options for our backend.
  - `constants`: Contains the default value for schedules.
  - `controllers`: Defines business logic.
  - `db`: Connect with database.
  - `interfaces`: Contains the interfaces for Mongo Object.
  - `middlewares`: Contains middleware.
  - `mock`: Contains mock data.
  - `models`: Has the models for all schemas.
  - `routes`: Contains routing information.
  - `test`: Has tests that we made.
  - `utils`: Contains utility functions.
  - `app.ts`: Define express.
​
## Instructions for Running the Application
### Frontend
#### Dependencies
- Backend must be set up and running.
- Use VSCode.
​
#### How to Run
- Run `npm i` to install all the necessary dependencies for the project.
- Run `npm start` to start the frontend.
​
### Backend
#### Dependencies
- MongoDB Community Server.
- MongoDB Compass (use `mongodb://localhost:27017` for the connection).
- Use VSCode.
​
#### How to Run
In the terminal, run the following commands in order:
- `npm i` to install all necessary dependencies.
- `npm run build` to compile all of the files.
- `npm run start` to start the server.
​
### Testing
#### Test Data
We have test data that can be imported into MongoDB.
​
Import Data from mock folder in the backend
​
#### Running Tests
To run tests:
- Download the REST Client extension.
- Navigate to the `.rest` file under `./src/test`.
- Click 'send request' above the test you want to run. The result will show on the right side of the screen.
- The expected output is in the comments.

## Attributions
- Daypilot-lite library: For the instructor Recommended and Student Office Hour Calendar. [More Info](https://aspnet.daypilot.org/scheduler-lite/)
- React-Schedule-Selector: For allowing students and instructors to select their schedules. [More Info](https://github.com/bibekg/react-schedule-selector)
- Jwt-Auth: [More Info](https://github.com/gitdagray/react_jwt_auth/tree/main)
- Node-Structure: [More Info](https://github.com/john-smilga/node-express-course), [Template](https://github.com/tuannguyensn2001/express-boilderplate/tree/main)
- React-Router: [More Info](https://github.com/gopinav/React-Router-Tutorials/tree/master)
- Swagger: [More Info](https://github.com/swagger-api/swagger-js)
- Logger: [More Info](https://github.com/adautomendes/winston-example/tree/master)
​
## Limitations
- Currently, there is no error handling, and no way to view error statuses.
