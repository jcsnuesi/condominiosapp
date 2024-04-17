'use strict'

module.exports = class VerifyData{
  
    constructor(){} 


    phonesLengthVerification(phoneNumber){
       
        const phoneVerified = phoneNumber.length == 10 ? true : new Error('Phone number must have 10 digits')
        console.log(phoneVerified)
        return phoneVerified


    }

    
}