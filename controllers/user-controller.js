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
        return new Promise((resolve, reject) => 
            Promise.all([
                //event 1
                User.findOneAndUpdate({
                    username: username
                }, {
                    $set: {
                        "currentJoke": jokeId
                    }
                }),
                //event a
               
            ])
            .then(([thingOne, thingTwo]) => resolve(thingOne))
            .catch(err => reject(err))
        )},
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
            //all of this needs to happen
            Promise.all([
                //event a
                User.findOneAndUpdate({
                    username: username 
                }, {
                    $inc: {
                        "jokesToday": 1
                    }
                }),         
                //event 1
                User.findOne({
                    username: username
                }).then((data) => {
                    if(data.jokesToday >= 3) { //4 jokes a day
                        resolve({ noJokeMessage: true })
                    } else {
                        Joke.findOne({
                            _id: {
                                $nin: data.jokesSeen
                            }
                        })
                        
                    }
                })
            ])   
            .then(([recordA, record1]) => resolve(record1))//but I only want 1
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