const express = require('express')
const router = express.Router()

router.use((req, res, next) => {
  next()
})


router.route('/')
// 获取首页段子列表（分页）
.get((req, res, next) => {

})
// 发布段子
.post((req, res, next) => {
    
})

router.route('/:joke_id')
// 获取段子详情
.get((req, res, next) => {

})
// 顶／踩段子
.put((req, res, next) => {

})
// 删除段子
.delete((req, res, next) => {

})

// 分页获取用户顶过的段子列表
router.get('/like', (req, res) => {

})

// 分页获取用户写过的段子列表
router.get('/written', (req, res) => {

})

module.exports = router
