var express = require('express')
var mongodb = require('./services/mongo_service')
var app = express()

var bodyParser = require('body-parser')
var loginMiddleware = require('./services/jwt_service').verifyToken;
var authHandlers = require('./controllers/auth_handlers')

var urlBodyEncoder = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json())
app.post('/signin', urlBodyEncoder, authHandlers.signin)
app.post('/signup', urlBodyEncoder, authHandlers.signup)
app.post('/signout', urlBodyEncoder, loginMiddleware,  authHandlers.signout)
app.post('/test',urlBodyEncoder,loginMiddleware,(req,res)=>{
    res.send("Hello")
})

var server = app.listen(8000)
console.log("Server running")
module.exports = app;