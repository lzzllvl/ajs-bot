const User = require('../models/User')
const users = require('../controllers/user-controller')
const replies = require('../controllers/reply-controller')
User.find({
    isSubscribed: true
}).then((data) => {
    console.log(data);
    //data.forEach()
}).catch(err => console.error(err))