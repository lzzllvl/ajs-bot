const replies = require('../controllers/reply-controller')
const users = require('../controllers/user-controller')
const jokes = require('../controllers/joke-controller')


const textReplies = {
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
                            }).catch(err => console.log(err))
                        }).catch(err => console.log(err))
                    }).catch(err => console.log(err))
                }
            }).catch(err => console.log(err))
        
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
    "HA! :D": (message) => {
        jokes.incrementLike(message.metadata.jokeId)
            .then(result => {
                replies.sendLike(message)
            })
    },
    "Meh :|": (message) => {
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




module.exports = function(message) {
    let replyFunc;
    switch(message.type) {
        case "text": 
            replyFunc = textReplies[message.body] || textReplies.noResponse         
            break;    
        case "start-chatting":
            replyFunc = textReplies.startChat
            break;
        default: 
            replyFunc = textReplies.noResponse
    } 
    replyFunc(message) 
}