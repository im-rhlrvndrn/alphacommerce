const Users = require('../models/users.model');
const { errorResponse, CustomError } = require('../utils/errorHandlers');

const router = require('express').Router();

router.route('/').get(async (req, res) => {
    try {
        const returnedUsers = await Users.find({});
        console.log('Users => ', returnedUsers);

        res.status(200).json({ success: true, user: returnedUsers });
    } catch (error) {
        console.error(error);
        errorResponse(res, { code: +error.code, message: error.message, toast: error.toastStatus });
    }
});

router.param('userId', async (req, res, next, userId) => {
    try {
        const returnedUser = await Users.findOne({ _id: userId })
            .populate({
                path: 'cart',
                select: ['_id'],
                // populate: {
                //     path: 'data',
                //     populate: { path: 'book' },
                // },
            })
            .populate({
                path: 'wishlists',
                // populate: {
                //     path: 'book',
                // },
            });
        if (!returnedUser) throw new CustomError('404', 'failed', 'No user found!');

        req.user = returnedUser;
        next();
    } catch (error) {
        console.error(error);
        errorResponse(res, { code: +error.code, message: error.message, toast: error.toastStatus });
    }
});

router.route('/:userId').get(async (req, res) => {
    try {
        console.log('User => ', req.user);

        res.status(200).json({ success: true, user: req.user._doc });
    } catch (error) {
        console.error(error);
        errorResponse(res, { code: +error.code, message: error.message, toast: error.toastStatus });
    }
});

module.exports = router;
