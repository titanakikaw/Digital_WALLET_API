module.exports = {
    success: function (res, data, message = "Success") {
        res.status(200).json({
            status: "success",
            message: message,
            data: data,
        });
    },

    error: function (res, message = "Internal Server Error", statusCode = 500) {
        res.status(statusCode).json({
        status: "error",
        message: message,
        });
    },
};