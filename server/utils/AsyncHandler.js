import logger from "./logger.js";

const AsyncHandler = (requestHandler) => async (req, res, next) => {
    try {
        await requestHandler(req, res, next);
    } catch (err) {
        // console.log(err);
        logger.error(
            `[${err.statusCode || 500}] \n` +
                (err.errors?.length
                    ? `Details: ${JSON.stringify(err.errors, null, 2)}\n`
                    : "") +
                (err.stack || "")
        );

        res.status(err.statusCode || 500).json({
            success: false,
            message: err.message,
        });
    }
};

export { AsyncHandler };

/*
The provided code defines an asyncHandler function in JavaScript,
which is designed to handle asynchronous operations in an
Express.js application. This function is a higher-order function,
meaning it takes another function (requestHandler) as an
argument and returns a new function that wraps the original one.

The returned function is an asynchronous middleware function
for Express.js, which takes the usual req, res, and next parameters.
Inside this function, a try...catch block is used to handle
any errors that might occur during the execution of the
requestHandler. The await keyword is used to wait
for the requestHandler to complete its asynchronous operation.

If the requestHandler executes successfully, the try block
completes without issues. However, if an error is thrown during
the execution, the catch block is triggered. In the catch block,
the response status is set to the error's code if it exists,
or defaults to 500 (Internal Server Error).
The response is then sent back as a JSON object containing a
success flag set to false and the error message.

This pattern is useful for simplifying error handling in
asynchronous routes or middleware in Express.js applications.
By using asyncHandler, developers can avoid repetitive
try...catch blocks in each route handler, leading to cleaner
and more maintainable code.
*/
