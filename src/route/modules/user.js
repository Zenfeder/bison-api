const express = require('express')
const router = express.Router()
const User = require('@controller/user.js')

let token = null

router.use((req, res, next) => {
    token = req.headers.authorization

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
    (new User()).profile({ token }).then(data => {
        res.status(200).send({ data })
    }).catch(err => {
        res.status(err.code).send({ message: err.message })
    })
})
// 修改个人信息（头像地址、昵称、性别）
.put((req, res, next) => {
    
})

// 注册-发送验证码
router.post('/register_vcode', (req, res) => {
    (new User()).registerVcode({ 
        email: req.body.email 
    }).then(data => {
        res.status(200).send({ data: null })
    }).catch(err => {
        res.status(err.code).send({ message: err.message })
    })
})

// 注册-提交注册信息
router.post('/register', (req, res) => {
    (new User()).register({
        name: req.body.name, 
        email: req.body.email, 
        password: req.body.password
    }).then(data => {
        res.status(200).send({ data })
    }).catch(err => {
        res.status(err.code).send({ message: err.message })
    })
})

// 登录
router.post('/login', (req, res) => {
    (new User()).login({
        nameOrEmail: req.body.nameOrEmail, 
        password: req.body.password
    }).then(data => {
        res.status(200).send({ data })
    }).catch(err => {
        res.status(err.code).send({ message: err.message })
    })
})

// 找回密码-发送邮件
router.post('/pwd_email', (req, res) => {
    
})

// 重置密码
router.post('/pwd_update', (req, res) => {
    
})

module.exports = router
