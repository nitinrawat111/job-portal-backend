export class ApiError extends Error {
    constructor(statusCode = 500, message = "Internal Server Error", errors = undefined) {
        super();
        this.name = "ApiError"; // To specifically indicate an ApiError (not general Error), when logging
        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;
    }
}  