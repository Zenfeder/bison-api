const config = require('@root/config.js')
const jwt = require('jsonwebtoken')

class Auth {
    constructor() {}

    jwtSign(data) {
        return jwt.sign(data, config.secret, { expiresIn: 86400 })
    }

    jwtVerify(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, config.secret, (err, decoded) => {
                if (err) 
                    return reject({ code: 500, message: '无效token' })
                
                resolve(decoded)
            })
        })
    }
}

module.exports = Auth