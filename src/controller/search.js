const nodejieba = require('nodejieba')
const JokeModel = require('@model/joke.js')

class Search {
    constructor() {}

    hotKeyword () {

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
                resolve(jokes)
            })
        })
    }
}

module.exports = Search