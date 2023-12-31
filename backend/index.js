'use strict'


const mongoose = require('mongoose')
var app = require('./app')
var port = 3993
var conection = 'mongodb://127.0.0.1:27017/cleaningService'

mongoose.set('strictQuery', true);
const connectBD = async () => {

    try {
        await mongoose.connect(conection, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log('MongoDB connected!')
    } catch (error) {
        console.log(error)
    }
}

app.listen(port, () =>{
    connectBD()
    console.log('Servidor corriendo.')
})

