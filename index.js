var express = require('express')
var mongodb = require('./services/mongo_service')
var ejs = require("ejs")
var app = express()
app.use(express.static("public"))
app.set("view engine",ejs)
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
app.get("/chapter",urlBodyEncoder,(req,res)=>{
    res.render("chapter.ejs")
})
app.get("/contact",urlBodyEncoder,(req,res)=>{
    res.render("contact.ejs")
})
app.get("/dash",urlBodyEncoder,(req,res)=>{
    res.render("dash.ejs")
})
app.get("/",urlBodyEncoder,(req,res)=>{
    res.render("dash.ejs")
})
app.get("/footer",urlBodyEncoder,(req,res)=>{
    res.render("footer.ejs")
})
app.get("/molecules",urlBodyEncoder,(req,res)=>{
    res.render("molecules.ejs")
})
app.get("/reactions",urlBodyEncoder,(req,res)=>{
    res.render("reactions.ejs")
})
app.get("/quiz",urlBodyEncoder,(req,res)=>{
    res.render("quiz.ejs")
})
app.get("/end",urlBodyEncoder,(req,res)=>{
    res.render("end.ejs")
})

var server = app.listen(8000)
console.log("Server running")
module.exports = app;