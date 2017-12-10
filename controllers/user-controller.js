const User = require('../models/User')
const Joke = require('../models/Joke')

module.exports = {
    createNewUser: (username, chatId) => {
        return User.create({
            username: username,
            chatId: chatId
        })
    },
    setCurrentJoke: (username, jokeId) => {
        //both of these need to happen before we can move on
        return  User.findOneAndUpdate({
                    username: username
                }, {
                    $set: {
                        "currentJoke": jokeId
                    }
                })
        },
    getCurrentPunchline: (username) => {
        return User.findOne({
                username: username
            })
            .then(user => {
                Joke.findOne({
                    _id: user.currentJoke
                }).then((data) => { 
                    User.findOneAndUpdate({
                        username: username
                    }, {
                        $push: {
                            jokesSeen: data._id
                    }
                    }).exec((err, res) => {
                        err ? reject(err): resolve(data)
                    })
                }).catch(err => reject(err))
            }).catch(err => reject(err))
    },
    getNextJoke: (username) => {
        return new Promise((resolve, reject) => {
            User.findOneAndUpdate({
                    username: username 
                }, {
                    $inc: {
                        "jokesToday": 1
                    }
                })
            .then((data) => {
                if(data.jokesToday >= 3) { //4 jokes a day
                    resolve({ noJokeMessage: true })
                } else {
                    Joke.findOne({
                        _id: {
                            $nin: data.jokesSeen
                        }
                    })
                    .then(record => resolve(record))
                    .catch(err => console.log(err))
                }
            }) 
            .catch(err => reject(err))
        })
    },
    subscribe: (username) => {
        return User.findOneAndUpdate({
            username: username
        }, {
            $set: {
                isSubscribed: true
            }
        })
    },
    unsubscribe: (username) => {
        return User.findOneAndUpdate({
            username: username
        }, {
            $set: {
                isSubscribed: false
            }
        })
    },
    getAllUsers: () => {
        return User.find({})
    }

}