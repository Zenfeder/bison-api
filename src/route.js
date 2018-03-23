const auth = require('./utils/auth')

module.exports = function(app) {
    app.all('*', (req, res, next) => {
        next()
    })

    app.route('/hello')
        .all((req, res, next) => {
            auth(req, res, next)
        })
        .get((req, res, next) => {
            res.json({
                message: 'Hello world...'
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