const Auth = require('@controller/auth.js')
const JokeModel = require('@model/joke.js')

class Joke extends Auth {
    constructor() {
        super()
    }
}

module.exports = Joke