const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = require('express').Router();
const Users = require('../models/users.model');
const Cart = require('../models/carts.model');
const { CustomError, errorResponse } = require('../utils/errorHandlers');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if email exists
        const user = await Users.findOne({
            email: email,
        })
            .populate({
                path: 'cart',
                populate: {
                    path: 'data.book',
                },
            })
            .populate({
                path: 'wishlists',
                populate: {
                    path: 'data',
                },
            });
        if (!user) throw new CustomError('401', 'failed', 'Invalid credentials');

        // Check if password is correct
        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) throw new CustomError('401', 'failed', 'Invalid credentials');

        // Create and assign a token
        const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET /*{ expiresIn: "24h" }*/);
        res.cookie('token', token, { path: '/', httpOnly: true });
        res.cookie('userId', user._id.toString(), { path: '/' });

        return res
            .status(200)
            .json({ success: true, data: { token, user: { ...user._doc, password: null } } });
    } catch (error) {
        console.error(error);
        errorResponse(res, {
            statusCode: +error.code,
            message: error.message,
            toast: error.toastStatus,
        });
    }
});

router.post('/signup', async (req, res) => {
    const { email, full_name, password, avatar } = req.body;
    try {
        // Check if email exists
        const user = await Users.findOne({
            email: email,
        })
            .populate({
                path: 'cart',
                populate: {
                    path: 'data.book',
                },
            })
            .populate({
                path: 'wishlists',
                populate: {
                    path: 'data',
                },
            });
        if (user)
            throw new CustomError(
                '401',
                'failed',
                `${email} is associated with another account. Please use another email`
            );

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newCart = new Cart({
            data: [],
        });

        const newUser = new Users({
            full_name,
            email,
            password: hashedPassword,
            avatar: avatar.url ? avatar : { url: '' },
            cart: newCart._id,
        });

        newCart.user = newUser._id;

        const savedUser = await newUser.save();
        await newCart.save();
        return res.status(201).json({ success: true, data: savedUser });
    } catch (error) {
        console.error(error);
        errorResponse(res, {
            statusCode: +error.code,
            message: error.message,
            toast: error.toastStatus,
        });
    }
});

router.get('/logout', (req, res) => {
    res.cookie('token', 'loggedout');
    res.cookie('userId', 'loggedout');
    res.status(200).json({ success: true, message: "You're logged out" });
});

module.exports = router;
