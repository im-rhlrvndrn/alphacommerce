const express = require('express');
const router = express.Router();
const { CustomError, errorResponse } = require('../utils/errorHandlers');
const Wishlists = require('../models/wishlists.model');
const authMiddleware = require('../middlewares');
const Wishlist = require('../models/wishlists.model');

// router.authMiddleware();
router
    .route('/')
    .get(authMiddleware, async (req, res) => {
        try {
            // ! req.user.id will be injected by the auth middleware
            console.log('Request user: ', req.user);
            if (!req.user.id) throw new CustomError('401', 'failed', 'Unauthorized: Access Denied');

            const returnedWishlists = await Wishlists.find({ user: req.user.id });
            res.status(200).json({ message: 'Your wishlists', result: returnedWishlists });
        } catch (error) {
            console.log('Error => ', error);
            errorResponse(res, {
                statusCode: +error.code,
                message: error.message,
                toast: error.toastStatus,
            });
        }
    })
    .post(async (req, res) => {
        const newItem = req.body.id;
        try {
            if (!req.user.id) throw new CustomError('401', 'failed', 'Unauthorized: Access Denied');

            const returnedReadlist = Wishlists.findOne({ user: req.user.id }).populate('data');
            const itemAlreadyExists = returnedReadlist.data.find((item) => item._id === id);
            if (itemAlreadyExists)
                throw new CustomError(
                    '409',
                    'warning',
                    `Item already exists in ${returnedReadlist.name}`
                );

            returnedReadlist.data.push(newItem);

            await returnedReadlist.save();
        } catch (error) {
            console.error(error);
            errorResponse(res, {
                statusCode: +error.code,
                message: error.message,
                toast: error.toastStatus,
            });
        }
    });

router.param('wishlistId', async (req, res, next, wishlistId) => {
    try {
        console.log('wishlist id from router.param() middleware', wishlistId);
        const returnedWishlist = await Wishlist.findOne({ _id: wishlistId });
        if (!returnedWishlist) throw new CustomError('404', 'failed', 'Wishlist not found!');

        req.wishlist = returnedWishlist._doc;
        next();
    } catch (error) {
        console.error(error);
        errorResponse(res, {
            statusCode: +error.code,
            message: error.message,
            toast: error.toastStatus,
        });
    }
});

router
    .route('/:wishlistId')
    .get(async (req, res) => {
        try {
            res.status(200).json({ success: true, wishlist: req.wishlist });
        } catch (error) {
            console.error(error);
            errorResponse(res, {
                statusCode: +error.code,
                message: error.message,
                toast: error.toastStatus,
            });
        }
    })
    .post(async (req, res) => {
        try {
        } catch (error) {
            console.error(error);
            errorResponse(res, {
                statusCode: +error.code,
                message: error.message,
                toast: error.toastStatus,
            });
        }
    });

module.exports = router;
