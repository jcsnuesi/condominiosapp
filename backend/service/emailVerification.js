'use strict'
const mailer = require('nodemailer');

// Handle the registration verification
exports.verifyRegistration = function (email) {

    const transporter = mailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: 'jcsnuesi@gmail.com',
            pass: 'rbrx htzt qdwd pahd'
        }
    });


     // Enviar correo electrónico de verificación
    const enlaceVerificacion = `http://localhost:3993/api/verify-email/${email}`;
    const mensajeCorreo = `Por favor, haz clic en el siguiente enlace para verificar tu cuenta: ${enlaceVerificacion}`;

    const mailOptions = {
        from: 'jcsnuesi@gmail.com',
        to: `${email}`,
        subject: 'Verificación de cuenta',
        text: mensajeCorreo
    };

 
    transporter.sendMail(mailOptions, (error, info) => {
        
        if (error) {
            console.error(error);
           
        }
        
        console.log('Correo de verificación enviado!!');
  
    });
   
};