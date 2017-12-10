const User = require('../models/User')
const users = require('../controllers/user-controller')
const replies = require('../controllers/reply-controller')

const dbhost = process.env.MONGODB_URI || "mongodb://localhost/chatbot"
const mongoose = require('mongoose')
mongoose.Promise = Promise
mongoose.connect(dbhost);
var db = mongoose.connection;
db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});
db.once("open", function() {
    console.log("Mongoose connection successful.")
})


User.find({
    isSubscribed: true
}).then((data) => {
    console.log(data);
    //data.forEach()
}).catch(err => console.error(err))