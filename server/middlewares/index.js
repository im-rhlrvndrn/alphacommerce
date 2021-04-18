const jwt = require('jsonwebtoken');
const CustomError = require('../utils/errorHandlers');

module.exports = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) throw new CustomError('400', 'failed', 'Invalid Token. Please login again');

        // Checks if the available token is valid
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        console.error(error);
        res.status(+error.code).json({
            statusCode: +error.code,
            message: error.message,
            toast: error.toastStatus,
        });
    }
};
