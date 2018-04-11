const express = require('express')
const router = express.Router()

router.use((req, res, next) => {
  next()
})

// 获取热搜关键字
router.get('/hot', (req, res) => {
    
})

// 获取搜索结果列表（分页）
router.get('/', (req, res) => {
    
})

module.exports = router
