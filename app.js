const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const passport = require('passport');
const config = require('./config');

const indexRouter = require('./routes/indexRouter');
const userRouter = require('./routes/userRouter');

// configure mongodb w/ mongoose
const mongoose = require('mongoose');
const url = config.mongoUrl;
const connect = mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

connect.then(() => console.log('Connected to server.'),
    err => console.log(err)
);

const app = express();
// Example HTTPS secure routing. 
// app.all('*', (req, res, next) => {
//     if (req.secure) {
//       return next();
//     } else {
//         console.log(`Redirecting to: https://${req.hostname}:${app.get('secPort')}${req.url}`);
//         res.redirect(301, `https://${req.hostname}:${app.get('secPort')}${req.url}`);
//     }
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', userRouter);

app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
