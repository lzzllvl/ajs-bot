const User = require('../models/User')
const users = require('../controllers/user-controller')
const replies = require('../controllers/reply-controller')
const request = require('request')
const dbhost = process.env.MONGODB_URI || "mongodb://localhost/chatbot"
const mongoose = require('mongoose')
mongoose.Promise = Promise
mongoose.connect(dbhost)
var db = mongoose.connection
db.on("error", function(error) {
    console.log("Mongoose Error: ", error)
});
db.once("open", function() {
    console.log("Mongoose connection successful.")
})


User.find({
    isSubscribed: true
}).then((data) => {
    Promise.all(
        data.map(val => {
            return users.getNextJoke(val.username)
                .then(joke => {
                    if(!joke.noJokeMessage) {
                        users.setCurrentJoke(val.username, joke._id).catch(err => console.log(err)) //to push the daily joke onto users' seen jokes


                        sendMessage(genJokeRequest(val, joke)).then(body => db.close())
                            .catch(err => console.log(err))
                    } else {
                        console.log(`The joke limit is exceeded for user:\n\t ${val.username}`)
                    }
                })
        })
    )
    .catch(err => {
        db.close()
        console.log("error:", err)
    })
})

function genJokeRequest(user, jokeRecord) {

    return {
        url: "https://api.kik.com/v1/message",
        auth: {
            user: "amazon.joke.services",
            pass: process.env.API_KEY 
        },
        json: {
            "messages": [{
                "chatId": user.chatId,
                "to": user.username,
                "body": jokeRecord.body.setup,
                "type": "text"
            },{
                "chatId": user.chatId,
                "to": user.username,
                "body": jokeRecord.body.punchline,
                "type": "text",
                "delay": 5000
            }]
        }
    }
}

function sendMessage (requestObj){ //normal text
    return new Promise((resolve, reject) => {
        request.post(requestObj, (err, result, body) => {
            err ? reject(err) : resolve(body)
        })
    })
} 
