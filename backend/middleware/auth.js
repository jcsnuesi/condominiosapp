'use strict'
 
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = "clave-nueva-para-cleanning-2023";

module.exports.authenticated = function(req, res, next) {
 

    if (!req.headers.authorization) {
 
        return res.status(403).send({

            message: "You don't have the corresponding authentication."
        })
        
    }

      //Limpiar el token y quitar comillar

      let token = req.headers.authorization.replace(/['"]+/g, '')
        
      try {
         
          var payload = jwt.decode(token, secret)
          
          //Comprobar si el token han expirado

          if (payload.exp <= moment().unix()) {

              return res.status(404).send({
                  message: "El token ha expirado."
              })

            }

        
      } catch (error) {


          return res.status(404).send({
              message: "El token no es valido."
          })
        
      }

    //Adjuntar usuario identificado a la request

    req.user = payload;

    //Pasar a la accion

    next();

}

exports.emailOwnerRegistration = function (req, res, next) {

    try {

        const token = req.headers.authorization.replace(/['"]+/g, '')

        var payload = jwt.decode(token, secret)

        //Comprobar si el token han expirado

        if (payload.exp <= moment().unix()) {

            return res.status(404).send({
                message: "El token ha expirado."
            })

        }


    } catch (error) {


        return res.status(404).send({
            message: "El token no es valido."
        })

    }

    //Adjuntar usuario identificado a la request

    req.ownerTokenDecoded = payload;

    next();

}

exports.emailToken = function (req, res, next){

    try {

        const token = req.params.id

        var payload = jwt.decode(token, secret)

        //Comprobar si el token han expirado

        if (payload.exp <= moment().unix()) {

            return res.status(404).send({
                message: "El token ha expirado."
            })

        }
        

    } catch (error) {


        return res.status(404).send({
            message: "El token no es valido."
        })

    }

    //Adjuntar usuario identificado a la request

    req.emailTokensVelidation = payload;

    next();

}