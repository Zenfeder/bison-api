module.exports = function(req, res, next) {
    let auth = true
    
    if (auth) {
        next()
    } else {
        res.json({
            message: '无权限'
        })
    }
}