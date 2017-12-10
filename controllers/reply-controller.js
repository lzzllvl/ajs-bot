//control the phases of a joke interaction.
//main process - send joke, wait for read, send punchline, receive feedback
let request = require('request')

function buildRequest(json){
    return {
        url: "https://api.kik.com/v1/message",
        auth: {
            user: "amazon.joke.services",
            pass: process.env.API_KEY // move to env
        },
        json: json
    }
}
function buildFirstJson(toUser, chatId){
    return {
        "messages": [{
                "chatId": chatId,
                "to": toUser,
                "body": "Hi there, " + toUser + "." ,
                "type": "text"
            }, {
                "chatId": chatId,
                "to": toUser,
                "body": "I'm Amazon Joke Services, but you can call me AJ. Or whatever you want, I won't know the difference, because I'm a bot. Basically, I tell jokes. That's about it.",
                "type": "text",
                "delay": 1000
            }, {
                "chatId": chatId,
                "to": toUser,
                "body": "You can text me 'joke' and I'll try to find you a fresh laugh. You can also 'subscribe' for daily texts if you can't be bothered to type out 'joke'.\nYou can also like or dislike my jokes. But remember, I'm a Bot - Don't do catching feelings",
                "type": "text",
                "delay": 6000
            }
        ]
    }
            
}
function buildSetupJson(toUser, chatId, body){
    return {
        "messages": [{
            "chatId": chatId,
            "to": toUser,
            "body": body,
            "type": "text"
        }]
    }
}
function buildPunchJson(toUser, chatId, joke){
    return { 
        "messages": [{
            "chatId": chatId,
            "to": toUser,
            "body": joke.body.punchline,
            "type": "text",
            "delay": 5000,
            "keyboards": [{
                "to": toUser,
                "hidden": false,
                "type": "suggested",
                "responses": [
                    {
                        "type": "text",
                        "body": "HA! :D",
                        "metadata": {
                            "jokeId": joke._id
                        }
                    },
                    {
                        "type": "text",
                        "body": "Meh :|",
                        "metadata": {
                            "jokeId": joke._id
                        }
                    }
                ]
            }] 
        }]
    }
}
function buildSubscribeJson(toUser, chatId){
    return {
        "messages": [{
            "chatId": chatId,
            "to": toUser,
            "body": "You have been successfully subscribed!",
            "type": "text"
        }]
    }
}
function buildUnsubscribeJson(toUser, chatId){
    return {
        "messages": [{
            "chatId": chatId,
            "to": toUser,
            "body": "You have unsubscribed.",
            "type": "text"
        }]
    }
}
function buildLikedJson(toUser, chatId){
    return {
        "messages": [{
            "chatId": chatId,
            "to": toUser,
            "body": "B)",
            "type": "text"
        }]
    }
}
function buildDislikedJson(toUser, chatId){
    return {
        "messages": [{
            "chatId": chatId,
            "to": toUser,
            "body": ":S",
            "type": "text"
        }]
    }
}
function buildNoResponseJson(toUser, chatId){
    return {
        "messages": [{
            "chatId": chatId,
            "to": toUser,
            "body": "I'm sorry, I didn't understand that - my first language is binary",
            "type": "text"
        }]
    }
}
function sendMessage (requestObj){ //normal text
    return new Promise((resolve, reject) => {
        request.post(requestObj, (err, result, body) => {
            err ? reject(err) : resolve(body)
        })
    })
} 


module.exports = {
    sendGreeting(message) {
        return sendMessage(buildRequest(buildFirstJson(message.from, message.chatId)))
    }, 
    sendSetup(message, joke) {
        return sendMessage(buildRequest(buildSetupJson(message.from, message.chatId, joke.body.setup)))
    },
    sendPunchline(message, joke) {
        return sendMessage(buildRequest(buildPunchJson(message.from, message.chatId, joke)))
    },  
    sendSubscribe(message) {
        return sendMessage(buildRequest(buildSubscribeJson(message.from, message.chatId)))
    }, 
    sendUnsubscribe(message) {
        return sendMessage(buildRequest(buildUnsubscribeJson(message.from, message.chatId)))
    }, 
    sendLike(message) {
        return sendMessage(buildRequest(buildLikedJson(message.from, message.chatId)))
    }, 
    sendDislike(message) {
        return sendMessage(buildRequest(buildDislikedJson(message.from, message.chatId)))
    },
    sendNoResponse(message) {
        return sendMessage(buildRequest(buildNoResponseJson(message.from, message.chatId)))
    }
}