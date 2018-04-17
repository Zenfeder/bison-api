const express = require('express')
const router = express.Router()
const Search = require('@controller/search.js')

let search = null

router.use((req, res, next) => {
    search = new Search()

    next()
})

// 获取热搜关键字
router.get('/hot', (req, res) => {
    search.hotKeyword().then(data => {
        res.status(200).send({ data })
    }).catch(err => {
        res.status(err.code).send({ message: err.message })
    })
})

// 获取搜索结果列表（分页）
router.get('/', (req, res) => {
    let keyword = req.query.keyword === undefined?'':req.query.keyword
    let offset = req.query.offset===undefined?0:(Number.isInteger(req.query.offset-0)?req.query.offset-0:0)
    let size = req.query.size===undefined?10:(Number.isInteger(req.query.size-0)&&req.query.size-0>0?req.query.size-0:10)

    if (!keyword.trim()) {
        res.status(403).send({ message: '搜索内容不能为空' })
        return
    }

    search.result({ keyword, offset, size }).then(data => {
        res.status(200).send({ data })
    }).catch(err => {
        res.status(err.code).send({ message: err.message })
    })
})

module.exports = router
