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
    set.forEach(val => {
        User.findOneAndUpdate({
            chatId: val.chatId
        },{
            $set: {
                jokesToday: 0
            }
        }).catch(err => console.log(err))
    })
})
.then(result => { db.close() ; console.log("Daily joke counts reset")})
.catch(err => { db.close() ; console.log(err) })