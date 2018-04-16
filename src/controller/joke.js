const Auth = require('@controller/auth.js')
const JokeModel = require('@model/joke.js')
const UserModel = require('@model/user.js')

class Joke extends Auth {
    constructor() {
        super()
    }

    list ({ offset, size }) {
        return new Promise((resolve, reject) => {
            JokeModel.find()
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

    detail ({ joke_id }) {
        return new Promise((resolve, reject) => {
            JokeModel.findById(joke_id, (err, joke) => {
                if (err) 
                    return reject({ code: 500, message: '数据查找失败' })
                if (!joke) 
                    return reject({ code: 404, message: '段子不存在' })

                UserModel.findById(joke.user_id, (err, user) => {
                    if (err) 
                        return reject({ code: 500, message: '数据查找失败' })
                    if (!user) 
                        return reject({ code: 500, message: '数据查找失败' })

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
            UserModel.findById(user_id, (err, user) => {
                if (err)
                    return reject({ code: 500, message: '段子发布失败' })
                if (!user)
                    return reject({ code: 404, message: '用户不存在' })

                let joke = new JokeModel({ 
                    content,
                    user_id: user._id,
                    user_name: user.name,
                    user_avator: user.avator
                })

                joke.save((err, doc) => {
                    if (err) 
                        return reject({ code: 500, message: '段子发布失败' })

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

    async remove ({ token, joke_id }) {
        let { user_id } = await this.jwtVerify(token)

        return new Promise((resolve, reject) => {
            JokeModel.findById(joke_id, (err, joke) => {
                if (err) 
                    return reject({ code: 500, message: '删除失败' })
                if (!joke) 
                    return reject({ code: 404, message: '段子不存在' })
                if (joke.user_id !== user_id)
                    return reject({ code: 403, message: '无删除权限'  })
                JokeModel.remove({ _id: joke_id }, err => {
                    if (err) 
                        return reject({ code: 500, message: '删除失败' })

                    UserModel.findById(user_id, (err, user) => {
                        if (err) 
                            return reject({ code: 500, message: '删除失败' })
                        if (!user)
                            return reject({ code: 404, message: '用户不存在' })

                        let jokeIdIndex = user.write_joke_ids.findIndex(id => id === joke_id)
                        user.write_joke_ids.splice(jokeIdIndex, 1)

                        user.save((err, doc) => {
                            if (err)
                                return reject({ code: 500, message: '删除失败' })

                            resolve()
                        })
                    })
                })
            })
        })
    }
}

module.exports = Joke