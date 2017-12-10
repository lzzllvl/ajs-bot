const Joke = require('../models/Joke')

module.exports = {
    getAllJokes: () => {
        return Joke.find({})  
    },
    incrementLike: (jokeId) => {
        console.log("like", jokeId)
        return Joke.findOneAndUpdate({
            _id: jokeId
        }, {
            $inc: {
                "stats.laughCount": 1 
            }
        })
    },
    incrementDislike: (jokeId) => {
        return Joke.findOneAndUpdate({
            _id: jokeId
        }, {
            $inc: {
                "stats.mehCount": 1 
            }
        })
    },  
    addJoke: (body) => {
        return Joke.create({
                body: {
                    setup: body.setup,
                    punchline: body.punchline
                }
            })
    },
    removeJoke: (jokeId) => {
        return
    } 
}