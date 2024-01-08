'use strict'

module.exports = class VerifyData{
  
    constructor(){}


    phonesConverter(params){

        for (const key in params) {


            if (key.includes('phone')) {

                var phoneNumbers = ((params[key]).includes(',')) ? (params[key]).split(',') : params[key]

            }
        }


        const truValue = []
        if (typeof phoneNumbers == 'object') {

            phoneNumbers.forEach((phonesN) => {
                truValue.push((phonesN.trim().length == 10))

            })
        } else {

            return (phoneNumbers.trim().length == 10) ? true : new Error('Does not meet minimun digits')
        }

        return truValue.includes(false) ?  new Error('Does not meet minimun digits') : true


    }

  
    

    hasEmail(params){

        
      const emails =  Object.keys(params).filter(key => key.includes('email'))
      
      if (emails.length > 1) {
          
          const emailReal = emails.map((emails) => {
              
              return params[emails].includes('@')
            })
            
            if (emailReal.includes(false)) {
                return new Error('It must be an email')
                
            }

          return true
            
        }else{
   
          return params[emails].includes('@') ? true : new Error('It must be an email')

        }
 

       
      

    }


    
}