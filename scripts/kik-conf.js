let request = require('request')
console.log(process.env.API_KEY, process.env.MONGODB_URI)
request.post({
    url: "https://api.kik.com/v1/config",
    auth: {
        user: "amazon.joke.services",
        pass: process.env.API_KEY
    },
    json: {
        "webhook": process.env.HOOK_URL, 
        "features": {
            "receiveReadReceipts": false, 
            "receiveIsTyping": false, 
            "manuallySendReadReceipts": false, 
            "receiveDeliveryReceipts": false
        }
    }
}, (err, res, body) => console.log(body));