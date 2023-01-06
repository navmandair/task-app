class Mailer {
    constructor() {
        return this
    }
    verify() {
        return true
    }
    sendMail(data, callback) {
    }
}

module.exports.createTransport = function (transporter, defaults) {
    mailer = new Mailer();
    return mailer;
}