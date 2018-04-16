const mongoose = require('@model/db.js')

const jokeSchema = mongoose.Schema({
    user_id: String,
    user_name: String,
    user_avator: String,
    content: String,
    like_user_ids: { type: [String], _id : false },
    dislike_user_ids: { type: [String], _id : false },
    comment_ids: { type: [String], _id : false },
    created_at: { type: String, default: Date.now() }
})

module.exports = mongoose.model('Joke', jokeSchema)
