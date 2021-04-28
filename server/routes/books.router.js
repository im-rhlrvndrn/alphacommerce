const express = require('express');
const Books = require('../models/books.model');
const router = express.Router();
const data = require('../data');
const { CustomError, errorResponse, successResponse } = require('../utils/errorHandlers');

router
    .route('/')
    .get(async (req, res) => {
        const { genre = 'horror' } = req.query;
        try {
            const returnedBooks = await Books.find({});
            // if (genre) await returnedBooks.find({ genres: { $in: [genre] } });
            res.status(200).json({ success: true, books: returnedBooks });
        } catch (error) {
            console.error(error);
            errorResponse(res, {
                code: +error.code,
                message: error.message,
                toast: error.toastStatus,
            });
        }
    })
    .post(async (req, res) => {
        const { body } = req;
        try {
            const { type } = body;
            switch (type) {
                case 'FETCH_DETAILS': {
                    const { limit, genre } = body;
                    const returnedBooks = await Books.find({ genres: { $in: [genre] } }).limit(
                        limit || 0
                    );

                    return successResponse(res, {
                        status: 200,
                        success: true,
                        data: { books: returnedBooks.map((book) => book._doc) },
                        toast: {
                            status: 'success',
                            message: `Successfully fetched ${limit} books`,
                        },
                    });
                }

                default:
                    throw new CustomError('500', 'failed', 'Invalid operation type');
            }
        } catch (error) {
            console.error(error);
            errorResponse(res, {
                code: +error.code,
                message: +error.message,
                toast: error.toastStatus,
            });
        }
    });

router.param('bookId', async (req, res, next, bookId) => {
    try {
        const returnedBook = await Books.findOne({ _id: bookId });
        if (!returnedBook) throw new CustomError('404', 'failed', 'No book found!');

        req.book = returnedBook;
        next();
    } catch (error) {
        console.error(error);
        errorResponse(res, { code: +error.code, message: error.message, toast: error.toastStatus });
    }
});

router
    .route('/:bookId')
    .get(async (req, res) => {
        try {
            console.log('Book entry => ', req.book._doc);
            res.status(200).json({ success: true, book: { ...req.book._doc } });
        } catch (error) {
            console.error(error);
            errorResponse(res, {
                code: +error.code,
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
                code: +error.code,
                message: error.message,
                toast: error.toastStatus,
            });
        }
    });

router.get('/create', async (req, res) => {
    try {
        data.forEach(async (book) => {
            const returnedBook = await Books.findOne({ name: book.name });
            if (returnedBook) return;

            const newBook = new Books({
                name: book.name,
                cover_image: book.cover_image,
                summary: {
                    text: book.summary.text.slice(0, 300),
                    excerpt: book.summary.text.slice(0, 100),
                },
                authors: [...book.authors],
                genres: [...book.genre],
                external_urls: {
                    amazon: book.link.url.text,
                },
                payment: {
                    tax: [{ name: 'GST', percentage: 18 }],
                },
                variants: [
                    {
                        type: 'ebook',
                        price: book.price.value,
                    },
                    {
                        type: 'hardcover',
                        price: book.price.value,
                    },
                    {
                        type: 'paperback',
                        price: book.price.value,
                    },
                ],
            });

            const savedBook = await newBook.save();
            if (!savedBook)
                throw new CustomError(
                    '500',
                    'failed',
                    'Could not create the book entity. Please try again later'
                );
        });
        res.status(201).json({
            message:
                'Successfully stored all the books in the DB. Click here to check books in DB https://cloud.mongodb.com/v2/607509072e6f9572e9fc6348#metrics/replicaSet/60750a80cfc0d057347cf05f/explorer/AlphaReads/books/find',
        });
    } catch (error) {
        errorResponse(res, {
            statusCode: +error.code,
            message: error.message,
            toast: error.toastStatus,
        });
    }
});

module.exports = router;
