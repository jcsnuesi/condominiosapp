'use strict'


function wsVerifyToken(req, res,next) {

 
    try {

        var accessToken = "8rwhj3lG0kpGpTUF5tFVttt1EXbZCFecjHdZBxFAB1VllUOtoVyZAFIC9otuvWuGZCNrlwD"
        var token = req.query['hub.verify_token']
        var challenge = req.query['hub.challenge']

        if (challenge != null && token != null && token === accessToken) {

            req.challenge = challenge
         
        } else {

          console.log('#1 Error en verificación de token')
        }

    } catch (error) {

        return res.status(400).send({
            status: 'error',
            message: 'Error en verificación de token'
        })

    }

    next();


}

module.exports = { wsVerifyToken }
