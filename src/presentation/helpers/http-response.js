const MissingParamsError = require('./missing-param-error');
const UnauthorizedError = require('./unauthorized-error');

module.exports = class HttpResponse {
    static badRequest(paramName) {
        return {
            statusCode: 400,
            body: new MissingParamsError(paramName)
        }
    }

    static serverError() {
        return {
            statusCode: 500
        }
    }

    static unauthorizedError() {
        return {
            statusCode: 401,
            body: new UnauthorizedError()
        }
    }
}