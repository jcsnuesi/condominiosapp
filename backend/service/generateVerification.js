"use strict";
const mailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
// Handle the registration verification
exports.verifyRegistration = async function (user) {
  const transporter = mailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "jcsnuesi@gmail.com",
      pass: EMAIL_PASSWORD,
    },
  });

  // Enviar correo electrónico de verificación
  const enlaceVerificacion = `http://localhost:3993/api/verify-email/${user.email}`;
  const mensajeCorreo = `Por favor, haz clic en el siguiente enlace para verificar tu cuenta: ${enlaceVerificacion} \n
    \n
    ==== Credenciales de acceso ====
    Email: ${user.email} \n
    Password: ${user.passwordTemp} \n
    `;

  const mailOptions = {
    from: "jcsnuesi@gmail.com",
    to: `${user.email}`,
    subject: "Verificación de cuenta",
    text: mensajeCorreo,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw Error("Error al enviar el correo de verificación", error);
  }
};

exports.CodeVerification = function (email, code) {
  const transporter = mailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "jcsnuesi@gmail.com",
      pass: EMAIL_PASSWORD,
    },
  });

  // Enviar correo electrónico de verificación
  const mensajeCorreo = `Your guest verification code is: ${code}`;

  const mailOptions = {
    from: "jcsnuesi@gmail.com",
    to: `${email}`,
    subject: "Verificación de cuenta",
    text: mensajeCorreo,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    }

    console.log("Correo de verificación enviado!!");
  });
};

exports.StaffRegistration = async function (fullobject) {
  let { email, password } = fullobject;

  console.log("Email:", email, "Password:", password);

  const transporter = mailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "jcsnuesi@gmail.com",
      pass: EMAIL_PASSWORD,
    },
  });

  // Enviar correo electrónico de verificación
  const enlaceVerificacion = `http://localhost:3993/api/staff-verify-email/${email}`;
  const mensajeCorreo = `Por favor, haz clic en el siguiente enlace para verificar tu cuenta: ${enlaceVerificacion} \n
    Password temporal: ${password} \n`;

  const mailOptions = {
    from: "jcsnuesi@gmail.com",
    to: `${email}`,
    subject: "Verificación de cuenta",
    text: mensajeCorreo,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw Error("Error al enviar el correo de verificación", error);
  }
};
