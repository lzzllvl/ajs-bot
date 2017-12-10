const keywords = {
    "joke": "joke",
    "subscribe": "subscribe",
    "unsubscribe": "unsubscribe",
    "HA! :D": "like",
    "Meh :|": "dislike"
}

module.exports = (messageBody) => {
    let found = Object.keys(keywords).filter((val) => {
        return messageBody.match(RegExp("\b" + val, 'i'))
    })
    console.log(keywords[found[0]])
    return found.length ? keywords[found[0]] : null;
}