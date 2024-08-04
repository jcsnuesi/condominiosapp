'use strict'

module.exports = class VerifyData{
  
    constructor(){} 


    phonesTransformation(phoneNumber){
        
        const phoneDirty = phoneNumber.trim().replace(/-/g, '')
  
        
        if (phoneDirty.length === 10) {
            
           
            return phoneDirty

        } else {

            throw new Error('Phone number must have 10 digits');
        }
    
      


    }

    
}