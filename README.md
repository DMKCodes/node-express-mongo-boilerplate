Overview:

node-express-mongo-boilerplate is a boilerplate backend intended for use with a React frontend for a MERN application.  This project includes routes and model for users as well as basic JWT token-based authentication.

Installation:

- Initialize an Express application in your project directory ('npm i express-generator', 'express <projectname>') to get initial bin setup.
- Download this repository to your project directory, replacing all files except for the bin directory.
- Install dependencies with 'npm i'.
- Test index and user routes with Postman or another API testing platform.

Technologies Used (version at time of publication): 

Intended Stack: MERN
- MongoDB: NoSQL document-oriented database. *To integrate with your existing MongoDB cluster: https://www.mongodb.com/docs/drivers/node/current/
- Express v4.18.2: Node.js web framework.
- React: Front end, component-based UI library.
- Node.js v18.14.2: JS runtime environment.

Dependencies: 
- jsonwebtoken v9.0.0: JSON Web Token implementation.
- mongoose v7.0.0: MongoDB asynchronous object modeling.
- morgan v1.10.0: HTTP request logger middleware.
- passport v0.4.0: Express-compatible authentication middleware. *Newer versions not yet compatible with JWT Token-Based auth. 
- passport-jwt v4.0.1: Passport authentication using JSON Web Tokens.
- passport-local v1.0.0: Local authentication for Passport.
- passport-local-mongoose v7.1.2: Mongoose plugin for passport-local.
- pug v3.0.2: View engine.

MongoDB Server Initial Config for Testing: 
1. Ensure MongoDB is installed on your system, and add path to MongoDB's binaries folder to your System Path variable.
2. Create a directory outside of your project directory named mongodb, and create a subfolder under it named data.
3. In a bash terminal, use command 'mongo' to start the Mongo REPL (Read Evaluate Print Loop) shell.
4. Use command 'db' then command 'use mern-boiler' (or a name of your choice, updating the mongoUrl in config.js accordingly.
5. Use command 'db.createCollection(users);' to initialize the users collection. 

Notes: 
- Some configurations are included for ease of initial testing - e.g., new users registered with an explicit admin property.  This should not be put into production as-is for security purposes.
- The config.js file contains a 'secret key' but has been included in this repository.  Suggest adding to .gitignore as part of setup (and using a more sensible secret key).
- This project was built and tested using a local MongoDB server and mongod v4.2.24.

Suggested for After Initial Setup: 
- Add HTTPS for secure communication.
