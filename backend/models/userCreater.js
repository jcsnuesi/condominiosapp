
var admin = require('./admin')
var owner = require('./owners')
var staff =require('./staff')
var occupant = require('./occupant')



userCreation = { 

    admin:{admin},
    staff: { staff },
    occupant: { occupant },
    owner:{owner}
   

    
}

module.exports = userCreation;