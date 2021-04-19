const router = require('express').Router();
const Book = require('../models/books.model');
const { CustomError, errorResponse } = require('../utils/errorHandlers');

router.route('/:genre').get(async (req, res) => {
    const { genre } = req.params;
    try {
        const returnedBooks = await Book.find({ genres: { $in: [genre] } });
        if (!returnedBooks.length)
            throw new CustomError('404', 'failed', `No books found with ${genre} genre `);

        res.status(200).json({ success: true, books: [...returnedBooks] });
    } catch (error) {
        console.error(error);
        errorResponse(res, { code: +error.code, message: error.message, toast: error.toastStatus });
    }
});

module.exports = router;
