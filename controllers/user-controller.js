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
        return  User.findOneAndUpdate({
                    username: username
                }, {
                    $set: {
                        "currentJoke": jokeId
                    }
                })
        },
    getCurrentPunchline: (username) => {
        return new Promise((resolve, reject) => {
            User.findOne({
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
        })
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
                if(data.jokesToday > 4) { 
                    resolve({ noJokeMessage: true }) 
                } else {
                    Joke.findOne({
                        _id: {
                            $nin: data.jokesSeen
                        }
                    })
                    .then(record => {
                        if(record) {
                            resolve(record)
                        } else {
                            //seen all the joke so far so cycle
                            User.findOneAndUpdate({
                                username: username
                            }, {
                                $set: {
                                    jokesSeen: []
                                }
                            }).then(resu => (console.log(resu)))
                            .catch(err => reject(err))
                        }
                    })
                    .catch(err => reject(err))
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