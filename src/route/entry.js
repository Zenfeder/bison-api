module.exports = function(app) {
    app.all('*', (req, res, next) => {
        // res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS")
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")

        next()
    })

    app.use('/user', require('@route/modules/user.js'))
    app.use('/joke', require('@route/modules/joke.js'))
    app.use('/search', require('@route/modules/search.js'))
}