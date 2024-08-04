'use strict'

const fs = require('fs');   
const wsService = require('../service/whatsappService');


var wsController = {

    sendWhatsappMessage: function (user) {

           
        try {
           
    
            const phoneNumber = `1${user.phone}` 
           
           // var message = messageObject[0];
           const profile = JSON.stringify({
               "messaging_product": "whatsapp",
               "recipient_type": "individual",
               "to": phoneNumber,
               "type": "text",
               "text": {
                  
                   "body": `Usuario registrado con éxito al condominio: *${user.condominioName.toUpperCase()}*. \n 
                   Nombre completo: ${user.ownerName} ${user.lastname} \n 
                   usuario: ${user.email} \n 
                   contraseña temporal: ${user.passwordTemp} \n `
               }
           });

           wsService.sendWhatsappMessage(profile);

           const data = JSON.stringify({
               "messaging_product": "whatsapp",
               "recipient_type": "individual",
               "to": phoneNumber,
               "type": "document",
               "document": {
                   "filename": "Reglamento del condominio",
                   "link": "https://www.gob.mx/cms/uploads/attachment/file/3184/titulo_segundo_parte1_Cartografia.pdf",
                    "caption": "Este documente contiene: \n 1. Reglamento del condominio, \n 2. Fecha de pago, \n 3. Fechas de reuniones, etc."
               }
           });
           wsService.sendWhatsappMessage(data);
         
       } catch (error) {
            console.log(error)
          
       }
        
    },
    getTextUser: function(message) {
        var text = ""
        var typeMessage = message.type;

        switch (typeMessage) {

            case 'text':

                text = message.text.body;

                break;
        
            default:
                console.log('Tipo de mensaje no soportado');
                break;
                
        }

        return text
    }
}

module.exports = wsController;