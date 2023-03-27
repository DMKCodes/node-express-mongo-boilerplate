const express = require('express');
const userRouter = express.Router();
const User = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate');
require('dotenv').config();

userRouter.route('/')
.get(authenticate.verifyUser, authenticate.verifyAdmin, async (req, res, next) => {
    try {
        const allUsers = await User.find();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ allUsers, status: 'All users successfully retrieved.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, async (req, res, next) => {
    try {
        const deleteResult = await User.deleteMany({ _id: { $ne: req.user._id } });

        res.setHeader('Content-Type', 'application/json');
        if (deleteResult.deletedCount === 0) {
            res.status(404).json({ status: 'No other users found to delete.' });
        } else {
            res.status(200).json({ status: 'All users successfully deleted.'});
        }
    } catch (err) {
        return next(err);
    }
});

userRouter.route('/:userId')
.get(authenticate.verifyUser, async (req, res, next) => {
    try {
        if (req.user._id.equals(req.params.userId) || req.body.admin) {
            const user = await User.findById(req.params.userId);

            res.setHeader('Content-Type', 'application/json');
            if (user) {
                res.status(200).json({ user, status: 'User successfully retrieved.' });
            } else {
                res.status(404).json({ error: 'This user does not exist.' });
            }
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(403).json({ error: 'You are not authorized to view this user.' });
        }
    } catch (err) {
        console.error(err);
        return next(err);
    }
})
.put(authenticate.verifyUser, async (req, res, next) => {
    try {
        if (req.user._id.equals(req.params.userId) || req.user.admin) {
            if (req.body.newVals?.password) {
                const newPassword = req.body.newVals.password;
                const user = await User.findById(req.params.userId);
                if (user) {
                    await user.setPassword(newPassword);
                    const updatedUser = await user.save();

                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json({ updatedUser, status: 'Password successfully changed.' });
                } else {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(404).json({ error: 'This user does not exist.' });
                }
            } else {
                const user = await User.findByIdAndUpdate(req.params.userId, {
                    $set: req.body.newVals
                }, {new: true});

                const updatedUser = await user.save();

                res.setHeader('Content-Type', 'application/json');
                if (updatedUser) {
                    res.status(200).json({ updatedUser, status: 'User successfully updated.' });
                } else {
                    res.status(404).json({ error: 'This user does not exist.' });
                }
            }
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(403).json({ error: 'You are not authorized to modify this user.'})
        }
    } catch (err) {
        return next(err);
    }
})
.delete(authenticate.verifyUser, async (req, res, next) => {
    try {
        if (req.user._id.equals(req.params.userId) || req.user.admin) {
            const deletedUser = await User.findByIdAndDelete(req.params.userId);

            res.setHeader('Content-Type', 'application/json');
            if (deletedUser) {
                res.status(200).json({ deletedUser, status: 'User successfully deleted.' });
            } else {
                res.status(404).json({ error: 'This user does not exist.' });
            }
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(403).json({ error: 'You are not authorized to delete this user.'})
        }
    } catch (err) {
        return next(err);
    }
});

userRouter.post('/register', async (req, res, next) => {
    try {
        const userExists = await User.findOne({ 
            $or: [{ username: req.body.username}, { email: req.body.email }] 
        });
        if (!userExists) {
            User.register(new User(
                { 
                    username: req.body.username, 
                    email: req.body.email, 
                    admin: req.body.admin 
                }), 
                req.body.password,
                () => {
                    passport.authenticate('local')(req, res, () => {
                        res.setHeader('Content-Type', 'application/json');
                        res.status(200).json({ status: 'Registration successful.' });
                    });
                }
            );
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(409).json({ error: 'This username or email is linked to an existing account. Please try again. Redirecting...' });
        }
    } catch (err) {
        return next(err);
    }
});

userRouter.post('/login', async (req, res, next) => {
    passport.authenticate('local', async (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            res.setHeader('Content-Type', 'application/json');
            console.log(info.message);
            if (info.message === 'Password or username is incorrect') {
                res.status(401).json({ error: 'Username or password is incorrect' });
            } else {
                res.status(401).json({ error: 'Unknown error during authentication' });
            }
        } else {
            try {
                const cookies = req.cookies;
                const newAccessToken = authenticate.getToken({ _id: user._id });
                const newRefreshToken = authenticate.getRefreshToken({ _id: user._id });

                if (cookies?.jwt) {
                    res.clearCookie('jwt', { 
                        httpOnly: true,
                        secure: true,
                        sameSite: 'None', 
                        maxAge: 24 * 60 * 60 * 1000
                    });
                }

                user.refreshToken = newRefreshToken;
                await user.save();

                res.cookie('jwt', newRefreshToken, { 
                    httpOnly: true,
                    secure: true,
                    sameSite: 'None',
                    maxAge: 24 * 60 * 60 * 1000
                });

                res.setHeader('Content-Type', 'application/json');
                res.status(200).json({ 
                    user: {
                        _id: user._id,
                        username: user.username,
                        admin: user.admin,
                        email: user.email
                    },
                    token: newAccessToken,
                    status: 'You have successfully logged in.'
                });
            } catch (err) {
                return next(err);
            }
        }
    })(req, res, next);
});

module.exports = userRouter;