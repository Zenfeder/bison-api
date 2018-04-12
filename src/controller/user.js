const Auth = require('@controller/auth.js')
const Email = require('@controller/email.js')
const UserModel = require('@model/user.js')
const { 
    getRandomCode, 
    validateEmail, 
    validateUsername,
    validatePassword
} = require('@utils/helper.js')

const bcrypt = require('bcryptjs')

class User extends Auth {
    constructor() {
        super()
    }

    registerVcode({ email }) {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ email }, (err, doc) => {
                if (err) 
                    return reject({ code: 500, message: '验证码发送失败' })
                if (doc && doc.name) 
                    return reject({ code: 403, message: '邮箱已被注册' })

                let emailer = new Email()
                let vcode = getRandomCode()

                emailer.send({
                    to: email,
                    subject: '注册验证码',
                    text: `验证码：${vcode}`,
                    html: `<p>验证码：<strong style="color:#F5A623">${vcode}</strong></p>`
                }).then(info => {
                    if (doc) {
                        doc.vcode = vcode
                        doc.save((err, doc) => {
                            if (err) 
                                return reject({ code: 500, message: '验证码发送失败' })

                            resolve()
                        })
                    } else {
                        let user = new UserModel({ email, vcode })
                        user.save((err, doc) => {
                            if (err) 
                                return reject({ code: 500, message: '验证码发送失败' })

                            resolve()
                        })
                    }
                }).catch(err => {
                    reject(err)
                })
            })
        })
    }

    register({ name, email, password }) {
        return new Promise((resolve, reject) => {
            if (!name || !email || !password)
                return reject({ code: 403, message: '注册信息不完整' })
            if (!validateUsername(name))
                return reject({ code: 403, message: '用户名格式错误' })
            if (!validatePassword(password))
                return reject({ code: 403, message: '密码应为6-12位非空字符' })

            UserModel.findOne({ email }, (err, user) => {
                if (err) 
                    return reject({ code: 500, message: '用户注册失败' })
                if (!user) 
                    return reject({ code: 403, message: '请先发送验证码' })

                user.name = name
                user.email = email
                user.password = bcrypt.hashSync(password, 8)
                user.created_at = Date.now()

                user.save((err, doc) => {
                    if (err) 
                        return reject({ code: 500, message: '用户注册失败' })

                    resolve(this.jwtSign({ user_id: doc._id }))
                })
            })
        })
    }

    login({ nameOrEmail, password }) {
        return new Promise((resolve, reject) => {
            if (!nameOrEmail || !password) 
                return reject({ code: 403, message: '登录信息不完整' })
            if (!validateEmail(nameOrEmail) && !validateUsername(nameOrEmail)) 
                return reject({ code: 403, message: '用户名或邮箱格式错误' })

            let filter = validateEmail(nameOrEmail)?{email:nameOrEmail}:{name:nameOrEmail}

            UserModel.findOne(filter, (err, user) => {
                if (err)
                    return reject({ code: 500, message: '用户登录失败' })
                if (!user)
                    return reject({ code: 404, message: '用户不存在' })

                if (!bcrypt.compareSync(password, user.password))
                    return reject({ code: 403, message: '密码错误' })

                resolve(this.jwtSign({ user_id: user._id }))
            })
        })
    }

    async profile({ token }) {
        let { user_id } = await this.jwtVerify(token)

        return new Promise((resolve, reject) => {
            UserModel.findById(user_id, (err, doc) => {
                if (err) 
                    return reject({ code: 500, message: '用户查找失败' })
                if (!doc) 
                    return reject({ code: 404, message: '用户不存在' })

                resolve({ id: doc._id, name: doc.name, email: doc.email })
            })
        })
    }
}

module.exports = User