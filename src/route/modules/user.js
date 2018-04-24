const express = require('express')
const router = express.Router()
const User = require('@controller/user.js')
const { USER_JOKES_TYPES } = require('@utils/constDef.js')

let token = ''
let user = null

router.use((req, res, next) => {
    token = req.headers.authorization
    user = new User()

    next()
})

router.route('/')
.all((req, res, next) => {
    if (!token) {
        res.status(401).send({ message: '请登录' })
        return
    }
    
    next()
})
// 获取个人信息
.get((req, res, next) => {
    user.profile({ token }).then(data => {
        res.status(200).send(data)
    }).catch(err => {
        res.status(err.code).send({ message: err.message })
    })
})
// 修改个人信息（头像地址、昵称、性别）
.put((req, res, next) => {
    let { avator, name, gender } = req.body

    user.updateProfile({ token, avator, name, gender }).then(data => {
        res.status(204).end()
    }).catch(err => {
        res.status(err.code).send({ message: err.message })
    })
})

router.route('/register_vcode')
// 注册-获取验证码
.get((req, res, next) => {
    let { email } = req.query
    user.registerVcodeSend({ email }).then(data => {
        res.status(204).end()
    }).catch(err => {
        res.status(err.code).send({ message: err.message })
    })
})
// 注册-认证验证码
.post((req, res, next) => {
    let { email, vcode } = req.body
    user.registerVcodeVerify({ email, vcode }).then(data => {
        res.status(204).end()
    }).catch(err => {
        res.status(err.code).send({ message: err.message })
    })
})

// 注册-提交注册信息
router.post('/register', (req, res) => {
    let { name, email, password } = req.body
    user.register({ name, email, password }).then(data => {
        res.status(200).send(data)
    }).catch(err => {
        res.status(err.code).send({ message: err.message })
    })
})

// 登录
router.post('/login', (req, res) => {
    let { nameOrEmail, password } = req.body
    user.login({ nameOrEmail, password }).then(data => {
        res.status(200).send(data)
    }).catch(err => {
        res.status(err.code).send({ message: err.message })
    })
})

// 修改密码
router.post('/pwd_update', (req, res) => {
    let { oldPwd, newPwd } = req.body
    user.updatePwd({ token, oldPwd, newPwd }).then(data => {
        res.status(204).end()
    }).catch(err => {
        res.status(err.code).send({ message: err.message })
    })
})

// 找回密码-发送邮件
router.post('/pwd_email', (req, res) => {
    let { email } = req.body
    user.resetPwdEmail({ email }).then(data => {
        res.status(204).end()
    }).catch(err => {
        res.status(err.code).send({ message: err.message })
    })
})

// 找回密码-重置密码
router.post('/pwd_reset', (req, res) => {
    let { password } = req.body
    user.resetPwd({ token, password }).then(data => {
        res.status(204).end()
    }).catch(err => {
        res.status(err.code).send({ message: err.message })
    })
})

// 分页获取用户相关段子（写过、顶过）列表
router.get('/jokes', (req, res) => {
    let type = req.query.type
    let offset = req.query.offset===undefined?0:(Number.isInteger(req.query.offset-0)?req.query.offset-0:0)
    let size = req.query.size===undefined?10:(Number.isInteger(req.query.size-0)&&req.query.size-0>0?req.query.size-0:10)

    if (!Object.keys(USER_JOKES_TYPES).includes(type)) {
        res.status(403).send({ message: '请指定具体列表类型' })
        return
    }

    user.jokes({ token, type, offset, size }).then(data => {
        res.status(200).send(data)
    }).catch(err => {
        res.status(err.code).send({ message: err.message })
    })
})

module.exports = router
