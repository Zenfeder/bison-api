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
// 分页获取首页段子列表
.get((req, res, next) => {
    let offset = req.query.offset===undefined?0:(Number.isInteger(req.query.offset-0)?req.query.offset-0:0)
    let size = req.query.size===undefined?10:(Number.isInteger(req.query.size-0)&&req.query.size-0>0?req.query.size-0:10)

    joke.list({ offset, size }).then(data => {
        res.status(200).send(data)
    }).catch(err => {
        res.status(err.code).send({ message: err.message })
    })
})
// 发布段子
.post((req, res, next) => {
    let content = req.body.content

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
        res.status(200).send(data)
    }).catch(err => {
        res.status(err.code).send({ message: err.message })
    })
})
// 顶／踩段子
.put((req, res, next) => {
    let joke_id = req.params.joke_id
    let type = req.body.type.trim()

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
// 分页获取段子评论列表
.get((req, res, next) => {
    let joke_id = req.params.joke_id
    let offset = req.query.offset===undefined?0:(Number.isInteger(req.query.offset-0)?req.query.offset-0:0)
    let size = req.query.size===undefined?10:(Number.isInteger(req.query.size-0)&&req.query.size-0>0?req.query.size-0:10)

    jokeComment.list({ joke_id, offset, size }).then(data => {
        res.status(200).send(data)
    }).catch(err => {
        res.status(err.code).send({ message: err.message })
    })
})
// 给段子写评论
.post((req, res, next) => {
    let joke_id = req.params.joke_id
    let content = req.body.content

    if (!content) {
        res.status(403).send({ message: '评论内容不能为空' })
        return
    }

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
