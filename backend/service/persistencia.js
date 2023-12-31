'use strict'

var Owner = require('../models/owners')
var Subowner = require('../models/occupant')


module.exports = function subownerPersistencia(id) {

    const fieldToUpdate = {
        status:"deactiaved"
    }

    Subowner.find({ superUser: id}, (err, subOwner) => {


        if (err || subOwner == null) {

                return false
                
            }

 
            
        Subowner.updateMany({ superUser: id }, fieldToUpdate, { multi: true }, (err, updated) =>{

            if (err) {

                return false                

            }

            return updated
            

        })

    })
    
}

