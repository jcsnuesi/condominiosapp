'use strict'

const https = require('https');

const wsService = {

    sendWhatsappMessage: function (data) {

      
        const options = {
            host:'graph.facebook.com',
            path:'/v19.0/357558404101003/messages',
            method:'POST',
            body: data,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer EAAOO7OaJOSIBO216tnD6wocZAEVuenm33h5wCTUm3i65BVmHvjDdjpu2ZAMuU1SZBv0ytdnYaZAwxA1O8ItL75DL5PhnFDgyBeH84J2ZAf5SjGJaP8S8DQDpdH99iXwL0yVnKZAdpClGL5TfjQOfuiF7ZAi28Ir7nT90MpfbI4yzkAOFymEkk13AZCB20Uss9aFj'
            }
        }

        const req = https.request(options, (res) => {
                      
            res.on('data', (chunk) => {
                process.stdout.write(chunk);
            });
        });

        req.on('error', (e) => {
            console.error(e);
        });

        req.write(data);
        req.end();
       
    }
}

module.exports = wsService;