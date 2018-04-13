const Auth = require('@controller/auth.js')
const JokeModel = require('@model/joke.js')
const UserModel = require('@model/user.js')

class Joke extends Auth {
    constructor() {
        super()
    }

    detail ({ joke_id }) {
        return new Promise((resolve, reject) => {
            JokeModel.findById(joke_id, (err, joke) => {
                if (err) 
                    return reject({ code: 500, message: '段子详情获取失败' })
                if (!joke) 
                    return reject({ code: 404, message: '段子不存在' })

                UserModel.findById(joke.user_id, (err, user) => {
                    if (err) 
                        return reject({ code: 500, message: '段子详情获取失败' })
                    if (!user) 
                        return reject({ code: 500, message: '段子详情获取失败' })

                    resolve({
                        id: joke._id,
                        content: joke.content,
                        created_at: joke.created_at,
                        like_num: joke.like_user_ids.length,
                        dislike_num: joke.dislike_user_ids.length,
                        comment_num: joke.comment_ids.length,
                        user_id: user._id,
                        user_name: user.name,
                        user_avator: user.avator
                    })
                })
            })
        })
    }

    async publish ({ token, content }) {
        let { user_id } = await this.jwtVerify(token)

        return new Promise((resolve, reject) => {
            let joke = new JokeModel({ user_id, content })

            joke.save((err, doc) => {
                if (err) 
                    return reject({ code: 500, message: '段子发布失败' })

                UserModel.findById(user_id, (err, user) => {
                    if (err) 
                        return reject({ code: 500, message: '段子发布失败' })
                    if (!user) 
                        return reject({ code: 404, message: '用户不存在' })

                    user.write_joke_ids.push(doc._id)
                    user.save((err, doc) => {
                        if (err)
                            return reject({ code: 500, message: '段子发布失败' })

                        resolve()
                    })
                })
            })
        })
    }

    async vote ({ token, joke_id, type }) {
        let { user_id } = await this.jwtVerify(token)
        let inverseType = type === 'like'?'dislike':'like'
       
        return new Promise((resolve, reject) => {
            JokeModel.findById(joke_id, (err, joke) => {
                if (err) 
                    return reject({ code: 500, message: '操作失败' })
                if (!joke) 
                    return reject({ code: 404, message: '段子不存在' })

                let userIdIndexMap = {
                    like: joke.like_user_ids.findIndex(id => id === user_id),
                    dislike: joke.dislike_user_ids.findIndex(id => id === user_id)
                }

                if (userIdIndexMap[type] > -1)
                    joke[type + '_user_ids'].splice(userIdIndexMap[type], 1)
                else {
                    joke[type + '_user_ids'].push(user_id)

                    if (userIdIndexMap[inverseType] > -1)
                        joke[inverseType + '_user_ids'].splice(userIdIndexMap[inverseType], 1)
                }
                    
                joke.save((err, doc) => {
                    if (err)
                        return reject({ code: 500, message: '操作失败' })

                    UserModel.findById(user_id, (err, user) => {
                        if (err) 
                            return reject({ code: 500, message: '操作失败' })
                        if (!user) 
                            return reject({ code: 404, message: '用户不存在' })

                        let jokeIdIndexMap = {
                            like: user.like_joke_ids.findIndex(id => id === joke_id),
                            dislike: user.dislike_joke_ids.findIndex(id => id === joke_id)
                        }

                        if (jokeIdIndexMap[type] > -1)
                            user[type + '_joke_ids'].splice(jokeIdIndexMap[type], 1)
                        else {
                            user[type + '_joke_ids'].push(joke_id)

                            if (jokeIdIndexMap[inverseType] > -1)
                                user[inverseType + '_joke_ids'].splice(jokeIdIndexMap[inverseType], 1)
                        }

                        user.save((err, doc) => {
                            if (err)
                                return reject({ code: 500, message: '操作失败' })

                            resolve()
                        })
                    })
                })
            })
        })
    }
}

module.exports = Joke