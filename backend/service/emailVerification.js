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
            pass: 'hkij mzxz npel jkzo'
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
    console.log(email)
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error al enviar el correo de verificación');
        } else {
            console.log('Correo de verificación enviado: ' + info.response);
           
        }

        res.status(200).send('Por favor, verifica tu correo electrónico para completar el registro.');
    });
   
};