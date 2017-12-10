const User = require('../models/User')
const Joke = require('../models/Joke')

module.exports = {
    createNewUser: (username) => {
        return User.create({
            username: username
        })
    },
    setCurrentJoke: (username, jokeId) => {
        return User.findOneAndUpdate({
            username: username
        }, {
            $set: {
                currentJoke: jokeId
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
            User.findOne({
                username: username
            }).then((data) => {
                Joke.findOne({
                    _id: {
                        $nin: data.jokesSeen
                    }
                })
                .then(record => resolve(record))
                .catch(err => reject(err))
            })
            .catch(err => {reject(err)})
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