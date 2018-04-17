const mongoose = require('@model/db.js')

const SearchKeywordSchema = mongoose.Schema({
    keyword: String,
    count: { type: Number, default: 1 },
    created_at: { type: String, default: Date.now() }
})

module.exports = mongoose.model('SearchKeyword', SearchKeywordSchema)
