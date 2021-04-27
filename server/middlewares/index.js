const jwt = require('jsonwebtoken');
const { CustomError, errorResponse } = require('../utils/errorHandlers');

module.exports = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) throw new CustomError('400', 'failed', 'Invalid Token. Please login again');

        // Checks if the available token is valid
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.auth = verified;
        next();
    } catch (error) {
        console.error(error);
        errorResponse(res, {
            code: +error.code,
            message: error.message,
            toast: error.toastStatus,
        });
    }
};
