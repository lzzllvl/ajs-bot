const replies = require('../controllers/reply-controller')
const users = require('../controllers/user-controller')
const jokes = require('../controllers/joke-controller')


const textReplies = {
    joke: (message) => {
        users.getNextJoke(message.from)
            .then(result => {
                console.log("1")
                users.setCurrentJoke(message.from, result._id)
                .then(jokeRecord => {
                    console.log("2")
                    replies.sendSetup(message, result)
                    .then(body => {
                        console.log("3")
                        users.getCurrentPunchline(message.from)
                        .then((jokeRecord) => {
                            console.log("calling joke")
                            replies.sendPunchline(message, jokeRecord)
                            
                        }).catch(err => console.log(err))
                    }).catch(err => console.log(err))
                }).catch(err => console.log(err))
            }).catch(err => console.log(err))
    }, 
    subscribe: (message) => {
        users.subscribe(message.from)
        .then(result => {
            replies.sendSubscribe(message)
        })
    },
    unsubscribe: (message) =>{
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
    }
}




module.exports = function(message) {
    let replyFunc;
    switch(message.type) {
        case "text": 

            replyFunc = textReplies[message.body] || textReplies.noResponse
            
            break;    
        case "start-chatting":
            replyFunc = (message) => {
                users.createNewUser({username:message.from})
                    .then(result => {
                        replies.sendGreeting(message)
                    })
            }
            break;
        default: 
            replyFunc = textReplies.noResponse
    } 
    
    replyFunc(message) 
}