class ResponseBuilder {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.response = {
            is_successful: false,
            request_uuid: req.headers['x-request-id'] || 'no-uuid',
            request_ip: req.ip,
            status_code: 400,
            message: 'Invalid payload',
            data: null,
            errors: null
        };
    }

    static api(req, res) {
        return new ResponseBuilder(req, res);
    }

    setStatusCode(code) {
        this.response.status_code = code;
        this.response.is_successful = code >= 200 && code < 300;
        return this;
    }

    setMessage(msg) {
        this.response.message = msg;
        return this;
    }

    setData(data) {
        this.response.data = data;
        return this;
    }

    setErrors(errors) {
        this.response.errors = errors;
        return this;
    }

    send() {
        return this.res.status(this.response.status_code).json(this.response);
    }
}

module.exports = ResponseBuilder;