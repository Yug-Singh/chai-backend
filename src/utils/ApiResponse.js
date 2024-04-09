// This is not provided by nodejs bcoz it's express framework and they don't have it yet


class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400 //Server status code 100 - 399
    }
}

export { ApiResponse }