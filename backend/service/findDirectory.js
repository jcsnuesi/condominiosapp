'use strict'

var AddresModel = require('../models/address')


var FindDirectoryController = {


    findDirectory : async function(addressId){

        const addressFound = await AddresModel.findOne({
            _id: addressId
        })
            .then(address => { return address })
            .catch(err => console.log(err))
        
        return addressFound.alias
    }


}

module.exports = FindDirectoryController;