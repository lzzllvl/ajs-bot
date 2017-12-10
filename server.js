//dependencies
const express = require('express'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      PORT = process.env.PORT || 4433,      
      DB_HOST = process.env.MONGODB_URI || "mongodb://localhost/chat-bot"
      Promise = require('bluebird')


mongoose.Promise = Promise
const db = mongoose.createConnection(DB_HOST, { useMongoClient: true})
      db.on("error", function(error) {
            console.log("Mongoose Error: ", error);
      })
      db.once("open", function() {
            console.log("Mongoose connection successful.");
      })


const app = express().use(bodyParser.json())
const hookRouter = express.Router()
require('./hooks/kikhook')(hookRouter)
app.use('/webhook', hookRouter)

app.listen(PORT, () => console.log(`Webhook listening on port ${PORT}`))