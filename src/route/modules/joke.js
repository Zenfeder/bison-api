const express = require('express')
const router = express.Router()
const Joke = require('@controller/joke.js')
const JokeComment = require('@controller/jokeComment.js')
const { JOKE_VOTE_TYPES } = require('@utils/constDef.js')

let token = ''
let joke = null
let jokeComment = null

router.use((req, res, next) => {
    token = req.headers.authorization
    joke = new Joke()
    jokeComment = new JokeComment()

    next()
})

router.route('/')
// 获取首页段子列表（分页）
.get((req, res, next) => {

})
// 发布段子
.post((req, res, next) => {
    let content = req.body.content

    if (!token) {
        res.status(401).send({ message: '请登录' })
        return
    }
    if (!content) {
        res.status(403).send({ message: '内容不能为空' })
        return
    }

    joke.publish({ token, content }).then(data => {
        res.status(204).end()
    }).catch(err => {
        res.status(err.code).send({ message: err.message })
    })
})

router.route('/:joke_id')
// 获取段子详情
.get((req, res, next) => {
    let joke_id = req.params.joke_id

    joke.detail({ joke_id }).then(data => {
        res.status(200).send({ data })
    }).catch(err => {
        res.status(err.code).send({ message: err.message })
    })
})
// 顶／踩段子
.put((req, res, next) => {
    let joke_id = req.params.joke_id
    let type = req.body.type.trim()

    if (!token) {
        res.status(401).send({ message: '请登录' })
        return
    }
    if (!Object.keys(JOKE_VOTE_TYPES).includes(type)) {
        res.status(403).send({ message: '请说明操作类型' })
        return
    }

    joke.vote({ token, joke_id, type }).then(data => {
        res.status(204).end()
    }).catch(err => {
        res.status(err.code).send({ message: err.message })
    })
})
// 删除段子
.delete((req, res, next) => {
    let joke_id = req.params.joke_id
    
    joke.remove({ token, joke_id }).then(data => {
        res.status(204).end()
    }).catch(err => {
        res.status(err.code).send({ message: err.message })
    })
})

router.route('/:joke_id/comment')
// 获取段子评论列表
.get((req, res, next) => {
    let joke_id = req.params.joke_id
    let offset = req.query.offset - 0
    let size = req.query.size - 0

    jokeComment.list({ joke_id, offset, size }).then(data => {
        res.status(200).send({ data })
    }).catch(err => {
        res.status(err.code).send({ message: err.message })
    })
})
// 给段子写评论
.post((req, res, next) => {
    let joke_id = req.params.joke_id
    let content = req.body.content

    jokeComment.publish({ token, joke_id, content }).then(data => {
        res.status(204).end()
    }).catch(err => {
        res.status(err.code).send({ message: err.message })
    })
})

// 删除评论
router.delete('/:joke_id/comment/:comment_id', (req, res) => {
    let joke_id = req.params.joke_id
    let comment_id = req.params.comment_id

    jokeComment.remove({ token, joke_id, comment_id }).then(data => {
        res.status(204).end()
    }).catch(err => {
        res.status(err.code).send({ message: err.message })
    })
})

module.exports = router
