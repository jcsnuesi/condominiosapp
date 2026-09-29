'use strict'

var fs = require('fs')
var path = require('path')

var Directory = {

    CreateDirectory: function (newDirectory, currentFilePath, fileName, fileNewName) {


        if (!fs.existsSync(newDirectory)) {
            fs.mkdirSync(newDirectory);
        }

        const rutaArchivoOrigen = path.join(currentFilePath, fileName);

        const rutaArchivoDestino = path.join(newDirectory, fileNewName);
        
        fs.rename(rutaArchivoOrigen, rutaArchivoDestino, (err) => {
            if (err) {
                console.error('Error al mover el archivo:', err);
            } else {
                console.log('Archivo movido correctamente.');
            }
        });

        
    }
}

module.exports = Directory;