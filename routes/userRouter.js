const express = require('express');
const userRouter = express.Router();
const User = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate');
const cors = require('./cors');

userRouter.route('/')
.get([cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin], async (req, res, next) => {
    try {
        const allUsers = await User.find();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(allUsers);
    } catch (err) {
        next(err);
    }
})
.delete([cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin], async (req, res, next) => {
    try {
        await User.deleteMany();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: true, status: 'All users successfully deleted.'});
    } catch (err) {
        next(err);
    }
});

userRouter.route('/:userId')
.get([cors.corsWithOptions, authenticate.verifyUser], async (req, res, next) => {
    try {
        if (req.user._id.equals(req.params.userId) || req.user.admin) {
            const user = await User.findById(req.params.userId);
            console.log(user);
            if (user) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(user);
            } else {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/plain');
                res.end('This user does not exist.');
            }
        } else {
            const err = new Error('You are not authorized to view this user.');
            res.statusCode = 403;
            return next(err);
        }
    } catch (err) {
        next(err);
    }
})
.put([cors.corsWithOptions, authenticate.verifyUser], async (req, res, next) => {
    try {
        if (req.user._id.equals(req.params.userId) || req.user.admin) {
            const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
                $set: req.body
            }, {new: true});

            if (updatedUser) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ success: true, updatedUser, status: 'User successfully updated.' });
            } else {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/plain');
                res.end('This user does not exist.');
            }
        } else {
            const err = new Error('You are not authorized to modify this user.');
            res.statusCode = 403;
            return next(err);
        }
    } catch (err) {
        next(err);
    }
})
.delete([cors.corsWithOptions, authenticate.verifyUser], async (req, res, next) => {
    try {
        if (req.user._id.equals(req.params.userId) || req.user.admin) {
            const deletedUser = await User.findByIdAndDelete(req.params.userId);
            
            if (deletedUser) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ success: true, deletedUser, status: 'User successfully deleted.' });
            } else {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/plain');
                res.end('This user does not exist.');
            }
        } else {
            const err = new Error('You are not authorized to delete this user.');
            res.statusCode = 403;
            return next(err);
        }
    } catch (err) {
        next(err);
    }
});

userRouter.post('/signup', cors.corsWithOptions, (req, res, next) => {
    try {
        User.register(new User(
            // admin incl. below for testing purposes w/ Postman, remove for production
            { username: req.body.username, email: req.body.email, admin: req.body.admin }), 
            req.body.password,
            (user) => {
                passport.authenticate('local')(req, res, () => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ success: true, user: user, status: 'Registration successful.' });
                });
            }
        );
    } catch (err) {
        next(err);
    }
});

userRouter.post('/login', [cors.corsWithOptions, passport.authenticate('local')], (req, res, next) => {
    try {
        const token = authenticate.getToken({ _id: req.user._id });
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: true, token: token, status: 'You have successfully logged in.' });
    } catch (err) {
        next(err);
    }
});

module.exports = userRouter;