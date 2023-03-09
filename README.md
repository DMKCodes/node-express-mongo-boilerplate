Overview:

node-express-mongo-boilerplate is a boilerplate backend intended for use with a React frontend for a MERN application.  This project includes routes and model for users as well as basic JWT token-based authentication.

Installation:

Download to your project directory, install dependencies with 'npm i', test index and user routes with Postman or another API testing platform.

Technologies Used (version at time of publication): 

Intended Stack: MERN
- MongoDB: NoSQL document-oriented database. *To integrate with your existing MongoDB cluster: https://www.mongodb.com/docs/drivers/node/current/
- Express v4.18.2: Node.js web framework.
- React: Frontend, component-based UI library.
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

Notes: 
- Some configurations are included for ease of initial testing - e.g., new users registered with an explicit admin property.  This should not be put into production as-is for security purposes.
- The config.js file contains a 'secret key' but has been included in this repository.  Suggest adding to .gitignore as part of setup (and using a more sensible secret key).
- This project was built and tested using a local MongoDB server and mongod v4.2.24.
- HTTPS and secure communication tested using an OpenSSL-generated key and cert.  These have been left out of the repository but can be generated using 'openssl req -nodes -new -x509 -keyout server.key -out server.cert' in the bin directory. 