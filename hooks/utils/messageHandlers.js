const textReplies = require('../utils/textReplies')
const translator = require('./utils/translator') // a little flexibility with user responses

module.exports = function(message) {
    let replyFunc;
    switch(message.type) {
        case "text": 
            replyFunc = textReplies[translator(message.body)] || textReplies.noResponse         
            break;    
        case "start-chatting":
            replyFunc = textReplies.startChat
            break;
        default: 
            replyFunc = textReplies.noResponse
    } 
    replyFunc(message) 
}