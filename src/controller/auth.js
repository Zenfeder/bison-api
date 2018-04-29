const config = require('@root/config.js')
const jwt = require('jsonwebtoken')

class Auth {
    constructor() {}

    jwtSign(data) {
        // expiresIn: 秒或具体描述时间的字符串. 如: 86400, "2 days", "10h", "7d"
        return jwt.sign(data, config.secret, { expiresIn: 86400*7 })
    }

    jwtVerify(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, config.secret, (err, decoded) => {
                if (err) 
                    return reject({ code: 401, message: '无效token' })
                
                resolve(decoded)
            })
        })
    }
}

module.exports = Auth