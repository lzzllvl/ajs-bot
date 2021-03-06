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

User.find({}).then(set => {
    Promise.all(
        set.map(val => {
            return User.findOneAndUpdate({
                chatId: val.chatId
            },{
                $set: {
                    jokesToday: 0
                }
            })
        })
    ).then(val => db.close())
    .catch(err => console.log(err))
})
.then(result => console.log("Daily joke counts reset"))
.catch(err => { db.close() ; console.log(err) })