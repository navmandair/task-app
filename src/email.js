const nodemailer = require('nodemailer');

const smtpHost = process.env.SMTP_HOST || null;
const smtpPort = process.env.SMTP_PORT || null;
const smtpUsername = process.env.SMTP_USERNAME || null;
const smtpPassword = process.env.SMTP_PASSWORD || null;
const smtpFromEmail = process.env.SMTP_FROM_EMAIL || null;

let transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    auth: {
        user: smtpUsername,
        pass: smtpPassword
    }
})
 
transporter.verify().then(() => {console.log('Connected to SMTP server')}).catch((error) => {console.log('SMTP Failed to connect:', error)});


const sendEmail = (toEmail, emailSubject, emailBody) => {
    message = {
        from: smtpFromEmail,
        to: toEmail,
        subject: emailSubject,
        text: emailBody
    }
    transporter.sendMail(message, function (err, info) {
        if (err) {
            console.log('SMTP Error', err.message)
        }
    })
}


module.exports = {
    sendEmail
}