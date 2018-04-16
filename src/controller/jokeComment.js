const Auth = require('@controller/auth.js')
const JokeModel = require('@model/joke.js')
const JokeCommentModel = require('@model/jokeComment.js')

class JokeComment extends Auth {
    constructor() {
        super()
    }

    list({ joke_id, offset = 0, size = 10 }) {

    }

    async publish({ token, joke_id, content }) {
        let { user_id } = await this.jwtVerify(token)

        return new Promise((resolve, reject) => {
            let jokeComment = new JokeCommentModel({ user_id, joke_id, content })

            jokeComment.save((err, doc) => {
                if (err) 
                    return reject({ code: 500, message: '评论发布失败' })

                JokeModel.findById(joke_id, (err, joke) => {
                    if (err) 
                        return reject({ code: 500, message: '评论发布失败' })
                    if (!joke) 
                        return reject({ code: 404, message: '段子不存在' })

                    joke.comment_ids.push(doc._id)

                    joke.save(err => {
                        if (err) 
                            return reject({ code: 500, message: '评论发布失败' })
                        resolve()
                    })
                })  
            })
        })
    }

    async remove({ token, joke_id, comment_id }) {
        let { user_id } = await this.jwtVerify(token)

        return new Promise((resolve, reject) => {
            JokeCommentModel.remove({ _id: comment_id }, err => {
                if (err)
                    return reject({ code: 500, message: '删除失败' })
                JokeModel.findById(joke_id, (err, joke) => {
                    if (err)
                        return reject({ code: 500, message: '删除失败' })
                    if (!joke)
                        return reject({ code: 404, message: '段子不存在' })

                    let commentIdIndex = joke.comment_ids.findIndex(id => id === comment_id)
                    joke.comment_ids.splice(commentIdIndex, 1)

                    joke.save(err => {
                        if (err)
                            return reject({ code: 500, message: '删除失败' })
                        resolve()
                    })
                })
            })
        })
    }
}

module.exports = JokeComment