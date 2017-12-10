const keywords = {
    "joke": "joke",
    "subscribe": "subscribe",
    "unsubscribe": "unsubscribe",
    "HA! :D": "like",
    "Meh :|": "dislike"
}

module.exports = (messageBody) => {
    let found = keywords.filter((val) => {
        return messageBody.includes(Regex(val, 'i'))
    })
    return found.length ? keywords[found[0]] : null;
}