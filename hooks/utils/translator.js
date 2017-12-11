const keywords = {
    "joke": "joke",
    "subscribe": "subscribe",
    "unsubscribe": "unsubscribe",
    "HA! :D": "like",
    "Meh :|": "dislike"
}

module.exports = (messageBody) => {
    let found = Object.keys(keywords).filter((val) => {S
        return messageBody.match(RegExp(`\\b${val}\\b`, 'i'))
    })
    return found.length ? keywords[found[0]] : null;
}