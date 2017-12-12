const replies = require('../../controllers/reply-controller')
const users = require('../../controllers/user-controller')
const jokes = require('../../controllers/joke-controller')
module.exports = {
    joke: (message) => {
        users.getNextJoke(message.from)
            .then(result => {
                if(result.noJokeMessage){
                    replies.sendJokeLimit(message)
                } else {                
                users.setCurrentJoke(message.from, result._id)
                    .then(jokeRecord => {
                        replies.sendSetup(message, result)
                        .then(body => {
                            users.getCurrentPunchline(message.from)
                            .then((jokeRecord) => {
                                replies.sendPunchline(message, jokeRecord)                      
                            }).catch(err => console.log(`Error retrieving punchline:\n\t${err}`))
                        }).catch(err => console.log(`Error sending joke setup:\n\t${err}`))
                    }).catch(err => console.log(`Error setting current joke:\n\t${err}`))
                }
            }).catch(err => console.log(`Error retreiving next joke:\n\t${err}`))
        
    }, 
    subscribe: (message) => {
        users.subscribe(message.from)
        .then(result => {
            replies.sendSubscribe(message)
        })
    },
    unsubscribe: (message) => {
        users.unsubscribe(message.from)
            .then(result => {
                replies.sendUnsubscribe(message)
            })
    }, 
    like: (message) => {
        jokes.incrementLike(message.metadata.jokeId)
            .then(result => {
                replies.sendLike(message)
            })
    },
    dislike: (message) => {
        jokes.incrementDislike(message.metadata.jokeId)
            .then(result => {
                replies.sendDislike(message)
            })

    }, 
    noResponse: (message) => {
        replies.sendNoResponse(message)
    },
    startChat: (message) => {
        users.createNewUser(message.from, message.chatId)
            .then(result => {
                replies.sendGreeting(message)
            })
    }
}