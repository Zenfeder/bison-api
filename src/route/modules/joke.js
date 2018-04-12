const express = require('express')
const router = express.Router()
const Joke = require('@controller/joke.js')

let token = null

router.use((req, res, next) => {
    token = req.headers.authorization

    next()
})

router.route('/')
// 获取首页段子列表（分页）
.get((req, res, next) => {

})
// 发布段子
.post((req, res, next) => {
    let content = req.body.content.trim()

    if (!token) {
        res.status(401).send({ message: '请登录' })
        return
    }
    if (!content) {
        res.status(403).send({ message: '内容不能为空' })
        return
    }

    (new Joke()).publish({ token, content }).then(data => {
        res.status(200).send({ data: null })
    }).catch(err => {
        res.status(err.code).send({ message: err.message })
    })
})

router.route('/:joke_id')
// 获取段子详情
.get((req, res, next) => {
    (new Joke()).detail({ joke_id: req.params.joke_id }).then(data => {
        res.status(200).send({ data })
    }).catch(err => {
        res.status(err.code).send({ message: err.message })
    })
})
// 顶／踩段子
.put((req, res, next) => {
    let type = req.body.type.trim()

    if (!token) {
        res.status(401).send({ message: '请登录' })
        return
    }

    if (!content) {
        res.status(403).send({ message: '内容不能为空' })
        return
    }

    (new Joke()).publish({ token, content }).then(data => {
        res.status(200).send({ data: null })
    }).catch(err => {
        res.status(err.code).send({ message: err.message })
    })
})
// 删除段子
.delete((req, res, next) => {

})

// 分页获取用户顶过的段子列表
router.get('/like', (req, res) => {

})

// 分页获取用户写过的段子列表
router.get('/write', (req, res) => {

})

router.route('/:joke_id/comment')
// 获取段子评论列表
.get((req, res, next) => {

})
// 给段子写评论
.post((req, res, next) => {
    
})

// 删除评论
router.delete('/:joke_id/comment/:comment_id', (req, res) => {

})

module.exports = router
