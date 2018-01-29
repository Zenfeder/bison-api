const auth = require('./utils/auth')

module.exports = function(app) {
    app.all('*', (req, res, next) => {
        next()
    })

    app.route('/book')
        .all((req, res, next) => {
            auth(req, res, next)
        })
        .post((req, res, next) => {
            res.json({
                message: `Your book is ${req.body.title}`
            })
        })

    app.route('/user/:id')
        .all((req, res, next) => {
            auth(req, res, next)
        })
        .get((req, res, next) => {
            res.json({
                message: `get user by id: ${req.params.id}`
            })
        })
        .put((req, res, next) => {
            res.json({
                data: req.body,
                message: `update user by id: ${req.params.id}`
            })
        })
        .delete((req, res, next) => {
            res.json({
                message: `delete user by id: ${req.params.id}`
            })
        })
}