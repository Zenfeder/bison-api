const mongoose = require('@model/db.js')

const jokeSchema = mongoose.Schema({
    user_id: String,
    content: String,
    like_user_ids: { type: [String], _id : false },
    dislike_user_ids: { type: [String], _id : false },
    comment_ids: { type: [String], _id : false },
    created_at: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Joke', jokeSchema)
