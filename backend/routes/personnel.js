'use strict'

let express = require('express');
let personnelController =  require('../controllers/personnel')

var route = express.Router();
var md_auth = require('../middleware/auth')


// GET

route.get('/personnels/:page', md_auth.authenticated, personnelController.getPersonnel);
route.get('/personnel/:id', md_auth.authenticated, personnelController.getPersonnelId);



// POST
route.post('/login-personnel', personnelController.loginPersonnel);

route.post('/create-personnel',md_auth.authenticated,personnelController.createPersonnel);


// PUT

route.put('/update-personnel', md_auth.authenticated, personnelController.updatePersonnel);

// DELETE

route.delete('/del-personnel/:id', md_auth.authenticated, personnelController.deletePersonnel);

module.exports =  route;