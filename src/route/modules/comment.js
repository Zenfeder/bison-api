const express = require('express')
const router = express.Router()

router.use((req, res, next) => {
  next()
})

router.route('/:joke_id')
// 获取段子评论列表
.get((req, res, next) => {

})
// 给段子写评论
.post((req, res, next) => {
    
})

// 删除评论
router.delete('/:joke_id/:comment_id', (req, res) => {

})

module.exports = router
