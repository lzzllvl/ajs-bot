const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new Schema({
    id: Schema.Types.ObjectId,
    username: {
        type: String,
        required: true,
        unique: true //should be by default from kik
    },
    chatId: {
        type: String,
        required: true,
        unique: true
    },
    isSubscribed: {
        type: Schema.Types.Boolean,
        default: false
    },
    jokesToday: {
        type: Number,
        default: 0
    },
    currentJoke: { //yet to receive punchline 
        type: Schema.Types.ObjectId,
        ref: 'Joke'
    },
    jokesSeen: [{
        type: Schema.Types.ObjectId,
        ref: 'Joke'
    }]
})

module.exports = mongoose.model('User', userSchema)