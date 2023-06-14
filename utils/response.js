module.exports = {
    success: function (res, data, message = "Success") {
        res.status(200).json({
            status: "success",
            message: message,
            data: data,
        });
    },

    error: function (res, details = "" , statusCode = 500) {
        let message = "";
        switch(statusCode){
            case 500: 
                message = "Internal Server Error";
                break;
            case 400:
                message = "Bad Request";
                break;
            case 401:
                message = "Unauthorized";
                break;
            case 403:
                message = "Forbidden";
                break;
            case 404:
                message = "Not Found";
                break;
            case 422:
                message = "Unprocessable Entity";
                break;
        }
        return res.status(statusCode).json({
        status: "error",
        message: message,
        details: details
        });
    },
};