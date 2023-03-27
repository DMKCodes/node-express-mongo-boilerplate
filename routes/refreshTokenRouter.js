const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authenticate = require('../authenticate');
const jwt = require('jsonwebtoken');

router.get('/', async (req, res, next) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwt) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(401).json({ error: 'No refresh token provided.' });
        }

        const refreshToken = cookies.jwt;

        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

        const foundUser = await User.findOne({ refreshToken }).exec();
        if (!foundUser) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(401).json({ error: 'No user associated with this token.' });
        }

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err || !foundUser._id.equals(decoded._id)) {
                    res.setHeader('Content-Type', 'application/json');
                    return res.status(403).json({ error: 'Invalid token.' });
                }

                const accessToken = authenticate.getToken({ _id: foundUser._id });
                const newRefreshToken = authenticate.getRefreshToken({ _id: foundUser._id });

                foundUser.refreshToken = newRefreshToken;
                await foundUser.save();
                
                res.cookie('jwt', newRefreshToken, { 
                    httpOnly: true, 
                    secure: true, 
                    sameSite: 'None', 
                    maxAge: 24 * 60 * 60 * 1000 
                });

                res.setHeader('Content-Type', 'application/json');
                return res.status(200).json({ 
                    token: accessToken,
                    user: {
                        _id: foundUser._id,
                        username: foundUser.username,
                        admin: foundUser.admin,
                        email: foundUser.email
                    },
                    status: 'You have successfully logged in.'
                });
            }
        );
    } catch (err) {
        return next(err);
    };
});

module.exports = router;