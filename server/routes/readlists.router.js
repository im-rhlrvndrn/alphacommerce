const express = require('express');
const Readlists = require('../models/readlists.schema');
const router = express.Router();

class CustomError extends Error {
    constructor(code = '400', toastStatus = 'success', ...params) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(...params);

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CustomError);
        }

        this.name = 'Error';
        // Custom debugging information
        this.code = code;
        this.date = new Date();
        this.toastStatus = toastStatus;
    }
}

router
    .route('/')
    .get(async (req, res) => {
        try {
            // ! req.user.id will be injected by the auth middleware
            if (!req.user.id) throw new CustomError('401', 'failed', 'Unauthorized: Access Denied');

            const returnedReadlists = Readlists.find({ user: req.user.id });
            res.status(200).json({ message: 'Your readlists', result: returnedReadlists });
        } catch (error) {
            console.log('Error => ', error);
            res.status(+error.code).json({
                statusCode: +error.code,
                message: error.message,
            });
        }
    })
    .post(async (req, res) => {
        const newItem = req.body.id;
        try {
            if (!req.user.id) throw new CustomError('401', 'failed', 'Unauthorized: Access Denied');

            const returnedReadlist = Readlists.findOne({ user: req.user.id }).populate('data');
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
            res.status(+error.code).json({
                statusCode: +error.code,
                message: error.message,
            });
        }
    });

router
    .route('/:id')
    .get(async (req, res) => {
        const { id } = req.params;
        try {
            const returnedReadlist = await Readlists.findOne({ _id: id });
            if (!returnedReadlist) throw new CustomError('404', 'failed', "Readlist doesn't exist");

            res.status(200).json(returnedReadlist);
        } catch (error) {
            res.status(+error.code).json({
                statusCode: +error.code,
                message: error.message,
            });
        }
    })
    .post(async (req, res) => {
        const { id } = req.params;
        try {
            const returnedReadlist = await Readlists.findOne({ _id: id });
            if (!returnedReadlist) throw new CustomError('404', 'failed', "Readlist doesn't exist");
        } catch (error) {
            res.status(+error.code).json({
                statusCode: +error.code,
                message: error.message,
            });
        }
    });

module.exports = router;
