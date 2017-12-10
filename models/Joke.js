const mongoose = require('mongoose')
const Schema = mongoose.Schema
const jokeSchema = new Schema({
    id: Schema.Types.ObjectId,
    body: {
        setup: {
            type: String,
            required: [ true, "Jokes must have an setup."],
            unique: true
        },
        punchline: {
            type: String,
            required: [ true, "Jokes must have a punchline" ]
        }
    },
    stats: {
        laughCount: {
            type: Number,
            default: 0,
            min: 0
        },
        mehCount: {
            type: Number,
            default: 0,
            min: 0
        }
    }
},{
    timestamps: true,    
})

module.exports = mongoose.model('Joke', jokeSchema)