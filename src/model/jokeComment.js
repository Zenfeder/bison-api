const mongoose = require('@model/db.js')

const JokeCommentSchema = mongoose.Schema({
    joke_id: String,
    content: String,
    user_id: String,
    user_name: String,
    user_avator: String,
    created_at: { type: String, default: Date.now() }
})

module.exports = mongoose.model('JokeComment', JokeCommentSchema)
