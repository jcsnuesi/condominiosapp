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

exports.ownerRegisterToken = function (user) {

    var payload = {
        sub: user.id,
        condominioId: user.condominioId,
        role: user.role,
        iat: moment().unix(),
        exp: moment().add(7, 'days').unix
    }

    return jwt.encode(payload, secret)


}



exports.emailVerification = function (info) {

    var payload = {
        id: info.id,
        uid: info.uid,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix
    }

    return jwt.encode(payload, secret)


}


exports.guestVerification = function(info){

    var payload = {
        id: info._id,
        fullname: info.fullname,
        email: info.notificationType,
        phone: info.phone,
        iat: moment().unix(),
        exp: moment().add(24, 'hours').unix
    }

    return jwt.encode(payload, secret)
}