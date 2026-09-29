const uuid = require("uuidv4");
const mailer = require("nodemailer");
let Condominio = require("../models/condominio");
const jwt = require("../service/jwt");
const validation = require("validator");

exports.emailOwnerRegister = async function (req, res, next) {
  var params = req.body;
  params.id = req.user.sub;
  params.role = req.user.role;
  params.organizationId = req.auth.organizationId;

  var emailSplit = params.email.split(/[ ,]/);

  const transporter = mailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Generate a unique registration token
  const registrationToken = jwt.ownerRegisterToken(params);

  try {
    const condominio = await Condominio.findOne({
      _id: params.condominioId,
      organizationId: req.auth.organizationId,
    });

    if (!condominio) {
      return res.status(404).send({
        message: "No se ha encontrado el condominio",
      });
    }

    if (String(condominio.organizationId) === String(req.auth.organizationId)) {
      const verificationLink = `http://localhost:3993/api/create-owner/${registrationToken}`;

      // Send the verification email
      const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: "",
        subject: `Unete a la app del condominio ${condominio.alias}`,
        text: `Por favor, haz clic en el siguiente enlace para comenzar el registro de tu cuenta: ${verificationLink}`,
      };

      emailSplit.forEach((email) => {
        try {
          let email_val = validation.isEmail(email.trim());

          if (!email_val) {
            throw new Error("El correo electrónico no es válido");
          }
        } catch (error) {
          return res.status(404).send({
            message: "El correo electrónico no es válido",
          });
        }

        mailOptions.to += `${email},`;
      });

      mailOptions.to = mailOptions.to.substring(0, mailOptions.to.length - 1);

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          res.status(500).send("Error al enviar el correo de verificación");
        } else {
          console.log("Correo de verificación enviado: " + info.response);
        }
      });

      res
        .status(200)
        .send(
          "Por favor, verifica tu correo electrónico para completar el registro."
        );
    } else {
      return res.status(404).send({
        message: "No tienes permisos para realizar esta acción",
      });
    }
  } catch (err) {
    return res.status(404).send({
      message: "No se ha encontrado el condominio",
    });
  }
};
