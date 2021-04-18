const express = require('express');
const router = express.Router();
const CustomError = require('../utils/errorHandlers');
const Wishlists = require('../models/wishlists.model');
const authMiddleware = require('../middlewares');

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
            res.status(+error.code).json({
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
            res.status(+error.code).json({
                statusCode: +error.code,
                message: error.message,
                toast: error.toastStatus,
            });
        }
    });

router
    .route('/:id')
    .get(async (req, res) => {
        const { id } = req.params;
        try {
            const returnedReadlist = await Wishlists.findOne({ _id: id });
            if (!returnedReadlist) throw new CustomError('404', 'failed', "Readlist doesn't exist");

            res.status(200).json(returnedReadlist);
        } catch (error) {
            console.error(error);
            res.status(+error.code).json({
                statusCode: +error.code,
                message: error.message,
                toast: error.toastStatus,
            });
        }
    })
    .post(async (req, res) => {
        const { id } = req.params;
        try {
            const returnedReadlist = await Wishlists.findOne({ _id: id });
            if (!returnedReadlist) throw new CustomError('404', 'failed', "Readlist doesn't exist");
        } catch (error) {
            console.error(error);
            res.status(+error.code).json({
                statusCode: +error.code,
                message: error.message,
                toast: error.toastStatus,
            });
        }
    });

module.exports = router;
