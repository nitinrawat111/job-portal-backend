// Represents the API response object
export class ApiResponse {
    constructor(statusCode, message = undefined, data = undefined, errors = undefined) {
        this.success = statusCode < 400;
        this.message = message;
        this.data = data;
        this.errors = errors
    }
}