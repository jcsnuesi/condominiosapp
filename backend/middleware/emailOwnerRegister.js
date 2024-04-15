const uuid = require('uuidv4')
const mailer = require('nodemailer');
let Condominio = require('../models/condominio')
const jwt = require('../service/jwt')

exports.emailOwnerRegister = function(req, res, next) {
    var params = req.body;

 
    const transporter = mailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: 'jcsnuesi@gmail.com',
            pass: 'hkij mzxz npel jkzo'
        }
    });

    // Generate a unique registration token
    const registrationToken = jwt.createToken(params);


    Condominio.findById(params.condominioId, (err, condominio) => {

        
        if(err || !condominio){

            return res.status(404).send({
                    message: 'No se ha encontrado el condominio'
            })
        }
        
       
        if (condominio.createdBy == req.user.sub) {

            const verificationLink = `http://localhost:3993/api/create-owner/${registrationToken}`;

         
            // Send the verification email
            const mailOptions = {
                from: 'jcsnuesi@gmail.com',
                to: 'jcsnuesi@gmail.com',
                subject: `Unete a la app del condominio ${condominio.alias}`,
                text: `Por favor, haz clic en el siguiente enlace para comenzar el registro de tu cuenta: ${verificationLink}`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                
                if (error) {
                    console.error(error);
                    res.status(500).send('Error al enviar el correo de verificación');
                } else {
                    console.log('Correo de verificación enviado: ' + info.response);
                }
            });

            res.status(200).send('Por favor, verifica tu correo electrónico para completar el registro.');

        }else{
                
                return res.status(404).send({
                    message: 'No tienes permisos para realizar esta acción'
                })
        }
        
    })

    
  


};

// Handle the registration verification
exports.verifyRegistration = function(req, res, next) {
    const registrationToken = req.params.token;

    // Retrieve the user associated with the registration token from the database or any other storage mechanism

    // Perform the user registration process

    // Optionally, mark the user as verified in the database

    // Return a response indicating successful registration
    res.status(200).send('Registration successful');
};