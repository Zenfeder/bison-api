const mongoose = require('@model/db.js')

const JokeCommentSchema = mongoose.Schema({
    user_id: String,
    joke_id: String,
    content: String,
    created_at: { type: String, default: Date.now() }
})

module.exports = mongoose.model('JokeComment', JokeCommentSchema)
