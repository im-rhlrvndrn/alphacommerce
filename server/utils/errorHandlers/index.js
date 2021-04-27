class CustomError extends Error {
    constructor(code = '500', toastStatus = 'failed', ...params) {
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

const errorResponse = (
    res,
    options = { code: 500, message: 'Internal Server Error', toast: 'failed' }
) => {
    const { code, message, toast } = options;
    return res.status(+code).json({
        statusCode: +code,
        message: message,
        toast: toast,
    });
};

const successResponse = (
    res,
    options = {
        status: 200,
        success: true,
        data: {},
        toast: { status: 'success', message: 'Successful operation' },
    }
) => {
    const { status, success, data, toast } = options;
    return res.status(status).json({
        success,
        data,
        toast,
    });
};

const summation = (arraySet, propertyName) =>
    arraySet.reduce((acc, curVal) => acc + curVal[propertyName], 0);

module.exports = { CustomError, errorResponse, successResponse, summation };
