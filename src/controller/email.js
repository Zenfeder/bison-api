const config = require('@root/config.js')
const { validateEmail } = require('@utils/helper.js')
const nodemailer = require('nodemailer')

class Email {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: config.email.host,
            port: config.email.port,
            secure: config.email.secure,
            auth: config.email.auth
        })
    }

    send({ from = config.email.from, to, subject, text, html }) {
        return new Promise((resolve, reject) => {
            if (!validateEmail(to)) 
                return reject({ code: 403, message: '邮箱格式错误' })

            this.transporter.sendMail(({ from, to, subject, text, html }), (err, info) => {
                if (err) {
                    console.error(err)
                    return reject({ code: 500, message: '邮件发送失败' })
                }

                resolve(info)
            })
        })
    }
}

module.exports = Email