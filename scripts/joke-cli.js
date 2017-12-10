const inquirer = require('inquirer')
const jokers = require('../controllers/joke-controller')
const users = require('../controllers/user-controller')
const fs = require('fs')
const dbhost = process.env.MONGODB_URI || "mongodb://localhost/chatbot"
const mongoose = require('mongoose')
mongoose.Promise = Promise
mongoose.connect(dbhost);
var db = mongoose.connection;
db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});
db.once("open", function() {
    console.log("Mongoose connection successful.");
    inquirer.prompt([
        {
            type: 'list',
            message: "\n",
            choices: [
                'View Jokes',
                'Add Joke',
                'Add User',
                'View Users',
                'Seed Jokes DB'
            ],
            name: 'action'
        }
    ]).then(function(answers) {
        switch(answers.action){
            case 'View Jokes':
                viewJokes()
                break
            case 'Add Joke':
                addJoke()
                break
            case 'Add User':
                addUser()
                break
            case 'View Users':
                viewUsers()
                break
            case 'Seed Jokes DB':
                seeder()
                break
        }
    }).catch(err => console.log(err));
})

function addJoke() {
    inquirer.prompt([
        {
            type: 'input',
            message: "Please Enter the Set Up to the Joke.",
            "name": "setup"
        }, 
        {
            type: 'input',
            message: 'Please Enter The Punchline',
            name: "punchline"
        }
    ]).then(answers => {
        jokers.addJoke({
            setup: answers.setup,
            punchline: answers.punchline
            })
            .then(data => {
                console.log(data)
                db.close()
            })
            .catch(err => { 
                console.log(err)
                db.close()
            })
        }
    )
    .catch(err => console.log(err))
}

function viewJokes(){ 
    jokers.getAllJokes()
        .then(data => {
            console.log(data)
            db.close()
        })
        .catch(err => { 
            console.log(err)
            db.close()
        })
}

function viewJokes(){ 
    jokers.getAllJokes()
        .then(data => {
            console.log(data)
            db.close()
        })
        .catch(err => { 
            console.log(err)
            db.close()
        })
}

function viewUsers(){ 
    users.getAllUsers()
        .then(data => {
            console.log(data)
            db.close()
        })
        .catch(err => { 
            console.log(err)
            db.close()
        })
}
function addUser() {
    inquirer.prompt([
        {
            type: 'input',
            message: "please enter the username",
            "name": "username"
        }]).then(answers => {
            users.createNewUser(answers.username)
                .then(data => {
                    console.log(data)
                    db.close()
                })
                .catch(err => {
                    console.log(err)
                    db.close()
                })

        })

}
function seeder() {
    fs.readFile(__dirname +'/seeds.json', 'utf8', (err, data) => {
        if (err) throw err
        JSON.parse(data).data.forEach(value => {
            jokers.addJoke(value.body)
                .then(result => { console.log(result); db.close()})
                .catch(err => { console.log(`Duplicate record:\n Joke Setup:\n\t${value.body.setup}`); db.close()})
        })
    })
}
