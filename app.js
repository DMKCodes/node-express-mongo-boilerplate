const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const passport = require('passport');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const indexRouter = require('./routes/indexRouter');
const refreshTokenRouter = require('./routes/refreshTokenRouter');
const userRouter = require('./routes/userRouter');

// configure mongodb w/ mongoose
const mongoose = require('mongoose');
const connect = mongoose.connect('mongodb://127.0.0.1:27017/mern-boiler', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

connect.then(() => console.log('Connected to server.'),
    err => console.log(err)
);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,PUT,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization, Access-Control-Allow-Credentials',
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/refresh', refreshTokenRouter);
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
    res.status(err.status || 500).json({ error: 'An error occurred while processing your request.' });
});

module.exports = app;
