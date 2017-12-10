let handlers = require('./messageHandlers.js')

module.exports = (hookRouter) => {
    hookRouter.get('/', (req, res) => {
        res.sendStatus(404)
    })

    hookRouter.post('/', (req, res) => {
        res.sendStatus(200) 
        let message = req.body.messages[0]
        handlers(message)    
    })
}