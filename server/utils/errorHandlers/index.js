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

module.exports = CustomError;
