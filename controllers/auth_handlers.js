const userModel = require('../models/user'),
      validator = require('./validation_errors'), 
      jwtService = require('../services/jwt_service');


class Log {
    constructor(url, input) {
        this.url = url;
        this.data = input;
        this.response = '';
    }
}
 
module.exports.signup = async (req, res) => {
    let log = new Log(req.url , req.body)
    try {
        const user = await userModel.create(req.body);
        const response = {
            "status": user.username + " is registered successfully.",
            "action" : "go to /signin url accessing dashboard."
        } 
        log.response = response;
        res.status(201).json(response)
    } catch (error) {
        const errors = validator.checkErrors(error); 
        log.response = errors;
        res.status(409).json(errors);
    }
    console.log(log);
}

module.exports.signin = async (req, res) => {
    let log = new Log(req.url , { username : req.headers.username , password : req.headers.password})
    const {headers} = req;
    try {
        const user = await userModel.login(headers.username, headers.password);
        console.log('Request received')
        const accessToken  = await jwtService.createToken(user._id);
        const refreshToken = await jwtService.createRefreshToken(user._id);
        res.cookie('accessToken',  accessToken , { httpOnly: true });
        res.cookie('refreshToken', refreshToken, { httpOnly: true });
        const response = {
            "status": user.username + " is logged in",
            "accessToken": accessToken,
            "refreshToken": refreshToken
        }
        log.response = response;
        res.status(200).json(response);
    } catch (error) { 
        log.response = error.message;
        res.status(400).json({"error":error.message});
    }
    console.log(log);
}

module.exports.signout = async (req, res) => {
    let log = new Log(req.url , "signout request")
    res.cookie('accessToken',  '', { maxAge: 1 })
    res.cookie('refreshToken', '', { maxAge: 1 })
    const response = { "status": "session destroyed" }
    log.response = response;
    console.log(log);
    res.status(200).json(response)
}