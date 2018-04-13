const mongoose = require('@model/db.js')

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    vcode: Number,
    verified: Boolean,
    password: String,
    gender: { type: Number, default: 0 }, // 0: 不详, 1: 男, 2: 女
    avator: {
        type: String, 
        default: 'https://ha-kafer.oss-cn-beijing.aliyuncs.com/img/default-avatar.png' 
    },
    write_joke_ids: { type: [String], _id : false },
    like_joke_ids: { type: [String], _id : false },
    dislike_joke_ids: { type: [String], _id : false },
    joke_comment_ids: { type: [String], _id : false },
    created_at: { type: String, default: Date.now() }
})

module.exports = mongoose.model('User', userSchema)
