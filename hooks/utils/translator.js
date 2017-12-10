const keywords = {
    "joke": "joke",
    "subscribe": "subscribe",
    "unsubscribe": "unsubscribe",
    "HA! :D": "like",
    "Meh :|": "dislike"
}

module.exports = (messageBody) => {
    let found = Object.keys(keywords).filter((val) => {
        console.log(messageBody.match(RegExp(val, 'i')))
        return messageBody.match(RegExp(val, 'i'))
    })
    return found.length ? keywords[found[0]] : null;
}