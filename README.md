##Overview:

This project is a boilerplate backend for rapid development of projects with the MExN stacks (MERN, MEVN, MEAN, etc.).

I have also developed a full stack MERN version featuring React, Redux, and RTK API: https://github.com/DMKCodes/mern-boilerplate/

##Initial Setup:

- Initialize an Express application in your project directory ('npm i express-generator', 'express [projectname]') to get initial bin setup.
- Download this repository to your project directory, replacing all files except for the bin directory.
- In the www file in the bin directory, ensure this line specifies port 3000: var port = normalizePort(process.env.PORT || '3000');
- Install dependencies for the root directory and client directory with 'npm i'.
- Create a .env file in the root directory, and in this file add ACCESS_TOKEN_SECRET='your access key' and REFRESH_TOKEN_SECRET='your refresh key'.

##MongoDB Server Initial Config for Testing:

- Ensure MongoDB is installed on your system, and add path to MongoDB's binaries folder to your System Path variable.
- Create a directory outside of your project directory named mongodb, and create a subfolder inside it named data.
- In a bash terminal in the mongodb directory, use command 'mongod --dbpath=data' to start the MongoDB server.
- In a bash terminal, use command 'mongo' to start the Mongo REPL (Read Evaluate Print Loop) shell.
- Use command 'db' then command 'use nem-boiler' or a name of your choice, updating the mongoUrl in the root directory's app.js file (line 15) accordingly.
- Use command 'db.createCollection('users');' to initialize the users collection.

##Testing:

- Use command 'npm start' to launch the server.
- Test all endpoints with Postman or a similar tool to ensure good working order.

##Features:

Back End (Node.js, Express.js, MongoDB)
- User model with Mongoose and Passport Local Mongoose.
- Comprehensive RESTful API to register, log in, view, modify, and delete users.
- Secure authentication with Passport and JSON Web tokens, using both access and refresh tokens for added security.

##Note:

As a relatively new programmer, I have done my best to implement security features in accordance with best practice, but I still have much to learn! PLEASE feel free to reach out with any comments or criticisms of my approaches.

##License: MIT

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: 

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
