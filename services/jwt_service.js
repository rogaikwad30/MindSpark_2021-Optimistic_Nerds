var jwt = require('jsonwebtoken')
const configs = require('../configs.json')

class Log {
  constructor(url, input) {
      this.url = url;
      this.data = input;
      this.response = '';
  }
}

module.exports.createToken = (id) => {
  return token = jwt.sign({ id }, configs.tokenSecret, { expiresIn: configs.tokenLife});
};

module.exports.createRefreshToken = (id) => {
  return token = jwt.sign({ id }, configs.refreshTokenSecret, { expiresIn: configs.refreshTokenLife });
};

module.exports.parseCookies  = (request) => {
  var list = {}, 
  rc = request.headers.cookie;
  rc && rc.split(';').forEach(function( cookie ) {
      var parts = cookie.split('=');
      list[parts.shift().trim()] = decodeURI(parts.join('='));
  });
  return list;
}

module.exports.verifyToken = async (req, res, next) => {
  const cookies = this.parseCookies(req);
  var accessToken  = cookies.accessToken  || "";
  var refreshToken = cookies.refreshToken || "";
  
  let log = new Log(req.url , {accessToken , refreshToken})
  let response = {}
  try {
    if (!accessToken) { 
      response = {"error" : "Unauthorized user" }
      log.response = response;
      console.log(log)
      return res.status(401).json(response)
    }
    const decrypt = await jwt.verify(accessToken, configs.tokenSecret);
    req.user = { id: decrypt.id };  
    next();
  } catch (err) {
    if(err.message.includes("jwt expired")){
      if (!refreshToken) {
        response = { "error": "Session timed out ....!  Please login again " }
        log.response = response;
        console.log(log)
        return res.status(401).json(response);
      }
      try {
        const decryption = await jwt.verify(refreshToken, configs.refreshTokenSecret );
        req.user = { id:  decryption.id };
        accessToken =  await this.createToken(decryption.id)
        refreshToken = await this.createRefreshToken(decryption.id)
        res.cookie('accessToken',  accessToken,  { httpOnly: true })
        res.cookie('refreshToken', refreshToken, { httpOnly: true })
        next();
      } catch (error) {
        response = error.message
        log.response = response;
        console.log(log)
        res.status(401).send(response)
      }
    }
    else{
        response = {"error" : "invalid token ." , "action" : "Login again"}
        log.response = response;
        console.log(log)
        res.status(401).json(response);
    }
  }
};