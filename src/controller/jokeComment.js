const Auth = require('@controller/auth.js')
const UserModel = require('@model/user.js')
const JokeModel = require('@model/joke.js')
const JokeCommentModel = require('@model/jokeComment.js')

class JokeComment extends Auth {
    constructor() {
        super()
    }

    list({ joke_id, offset, size }) {
        return new Promise((resolve, reject) => {
            JokeModel.findById(joke_id, (err, joke) => {
                if (err) 
                    return reject({ code: 500, message: '数据查找失败' })
                if (!joke)
                    return reject({ code: 404, message: '段子不存在' })

                JokeCommentModel.find({
                    '_id': {
                        $in: joke.comment_ids
                    }
                })
                .skip(offset)
                .limit(size)
                .exec((err, docs) => {
                    if (err) 
                        return reject({ code: 500, message: '数据查找失败' })

                    let comments = []

                    docs.forEach(elem => {
                        comments.push({
                            id: elem._id,
                            joke_id: elem.joke_id,
                            content: elem.content,
                            user_id: elem.user_id,
                            user_name: elem.user_name,
                            user_avator: elem.user_avator,
                            created_at: elem.created_at
                        })
                    })

                    resolve(comments)
                })
            })
        })
    }

    async publish({ token, joke_id, content }) {
        let { user_id } = await this.jwtVerify(token)

        return new Promise((resolve, reject) => {
            UserModel.findById(user_id, (err, user) => {
                if (err)
                    return reject({ code: 500, message: '评论发布失败' })
                if (!user)
                    return reject({ code: 404, message: '用户不存在' })

                let jokeComment = new JokeCommentModel({ 
                    joke_id, 
                    content,
                    user_id,
                    user_name: user.name,
                    user_avator: user.avator,
                })

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