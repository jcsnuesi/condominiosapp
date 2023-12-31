'use strict'

var jwt = require('jwt-simple')

var moment = require('moment')
var secret = "clave-nueva-para-cleanning-2023";

exports.createToken = function (user) {

     var payload = {
         sub: user._id,
         email: user.email,
         password: user.password,
         role: user.role,
         iat: moment().unix(),
         exp: moment().add(30, 'days').unix
     }

    return jwt.encode(payload, secret)
    
    
}