'use strict'

var express = require('express');
var GuestController = require('../controllers/guest');
var route = express.Router();
var auth = require('../middleware/auth');

//Rutas GET
route.get('/guests', auth.authenticated, GuestController.getGuest);
route.get('/guestById', auth.authenticated, GuestController.getGuestById);


//Rutas POST
route.post('/scheduleGuest', auth.authenticated, GuestController.createGuest);

//Rutas PUT

route.put('/updateGuest', auth.authenticated, GuestController.updateGuest);

//Rutas DELETE

route.delete('/deleteGuest', auth.authenticated, GuestController.deleteGuest);



module.exports = route;

