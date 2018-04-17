const nodejieba = require('nodejieba')
const JokeModel = require('@model/joke.js')
const SearchKeywordModel = require('@model/searchKeyword.js')

class Search {
    constructor() {}

    hotKeyword () {
        return new Promise((resolve, reject) => {
            SearchKeywordModel.find()
            .sort({ count: -1 })
            .limit(5)
            .exec((err, docs) => {
                if (err) 
                    return reject({ code: 500, message: '热搜关键字获取失败' })

                let keywords = []
                docs.forEach(elem => {
                    keywords.push({ keyword: elem.keyword })
                })
                resolve(keywords)
            })
        })
    }

    countSearchKeyword({ keyword }) {
        return new Promise((resolve, reject) => {
            SearchKeywordModel.findOne({ keyword }, (err, doc) => {
                if (err) 
                    return reject({ code: 500, message: '搜索失败' })

                if (doc) {
                    doc.count ++
                    doc.save(err => {
                        if (err) 
                            return reject({ code: 500, message: '搜索失败' })
                        resolve()
                    })
                }

                if (!doc) {
                    let searchKeyword = new SearchKeywordModel({ keyword })
                    searchKeyword.save(err => {
                        if (err) 
                            return reject({ code: 500, message: '搜索失败' })
                        resolve()
                    })
                }
            })       
        })
    }

    result ({ keyword, offset, size }) {
        let keywordList = nodejieba.cut(keyword)

        return new Promise((resolve, reject) => {
            JokeModel.find({
                content: new RegExp(keywordList.join('|') + '+', 'i')
            })
            .skip(offset)
            .limit(size)
            .exec((err, docs) => {
                if (err) 
                    return reject({ code: 500, message: '数据查找失败' })

                let jokes = []

                docs.forEach(elem => {
                    jokes.push({
                        id: elem._id,
                        content: elem.content,
                        user_id: elem.user_id,
                        user_name: elem.user_name,
                        user_avator: elem.user_avator,
                        like_num: elem.like_user_ids.length,
                        dislike_num: elem.dislike_user_ids.length,
                        comment_num: elem.comment_ids.length,
                        created_at: elem.created_at
                    })
                })

                resolve({ keywords: [keyword, ...keywordList], list: jokes })

                this.countSearchKeyword({ keyword })
            })
        })
    }
}

module.exports = Search