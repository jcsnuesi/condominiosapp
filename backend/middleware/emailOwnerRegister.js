const uuid = require('uuidv4')
const mailer = require('nodemailer');
let Condominio = require('../models/condominio')
const jwt = require('../service/jwt')
const validation = require('validator')

exports.emailOwnerRegister = function(req, res, next) {

    var params = req.body;
    params.id = req.user.sub;
    params.role = req.user.role;

    var emailSplit = params.email.split(/[ ,]/);  
   
 
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
    const registrationToken = jwt.ownerRegisterToken(params);


    Condominio.findById(params.condominioId)
    .exec((err, condominio) => {

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
                to: '',
                subject: `Unete a la app del condominio ${condominio.alias}`,
                text: `Por favor, haz clic en el siguiente enlace para comenzar el registro de tu cuenta: ${verificationLink}`
            };

            emailSplit.forEach(email => {


                try {

                    let email_val = validation.isEmail(email.trim())


                    if (!email_val) {
                        throw new Error('El correo electrónico no es válido')
                    }


                } catch (error) {


                    return res.status(404).send({
                        message: 'El correo electrónico no es válido'
                    })

                }

                mailOptions.to += `${email},`

            });
            
            mailOptions.to = mailOptions.to.substring(0, mailOptions.to.length - 1)


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
