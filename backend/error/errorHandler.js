

let errors = {

    errorRegisteringUser: function (error, userFound) {

        var duplicatedUser = []
    
        if (error != null) {
            duplicatedUser.push(true)
            duplicatedUser.push(500)
            duplicatedUser.push(error)
            return duplicatedUser
            
        } else if (userFound != null) {
                     
            duplicatedUser.push(true)
            duplicatedUser.push(401)
        
            
            duplicatedUser.push(`Email and/or phone number already exits,`)
            
            return duplicatedUser
        }
        
        else{

            return false
        }

    },
    newUser: function (err,newUser) {

        var newUserArr = []

        if (err != null) {
            newUserArr.push(true)
            newUserArr.push(500)
            newUserArr.push("error")
            newUserArr.push(err._message)
            return newUserArr            
        } else if (newUser != null) {

            newUserArr.push(true)
            newUserArr.push(200)
            newUserArr.push("success")
            newUserArr.push(newUser)
            return newUserArr
        }


        
    },
    loginExceptions: function (err, accountFound){

        var userLoginArr = []

        if (err != null) {
            userLoginArr.push(true)
            userLoginArr.push(500)
            userLoginArr.push("error")
            userLoginArr.push(err)
            return userLoginArr
        } else if (accountFound == null) {

            userLoginArr.push(true)
            userLoginArr.push(404)
            userLoginArr.push("error")
            userLoginArr.push("User does not exits")
            return userLoginArr
        } else{
            return false;
        }

    }, update: function (err, user){

        var userArr = []

        if (err != null) {
            userArr.push(true)
            userArr.push(500)
            userArr.push("error")
            userArr.push(err._message)
            return userArr

        } else if (Object.keys(user).length > 0 || user != null || user != undefined) {
            console.log(user)
            userArr.push(true)
            userArr.push(200)
            userArr.push("success")
            userArr.push(user)
            return userArr
        }

        return user 

    },
    
    UpdateGuest: function (err, newUser) {

        var newUserArr = []

        if (err != null) {
            newUserArr.push(true)
            newUserArr.push(500)
            newUserArr.push("error")
            newUserArr.push(err._message)
            return newUserArr
        } else if (newUser == null) {

            newUserArr.push(true)
            newUserArr.push(403)
            newUserArr.push("error")
            newUserArr.push("Does not have authorization")
            return newUserArr

        } else if (newUser != null) {

            newUserArr.push(true)
            newUserArr.push(200)
            newUserArr.push("success")
            newUserArr.push(newUser)
            return newUserArr
        }



    } ,reserveException: function (error, reserveFound) {

        var duplicatedUser = []

        if (error != null) {
            duplicatedUser.push(true)
            duplicatedUser.push(500)
            duplicatedUser.push(error)
            return duplicatedUser

        } else if (reserveFound != null) {

           
            duplicatedUser.push(true)
            duplicatedUser.push(401)
           
            
            duplicatedUser.push(`Revervation already exits: ${reserveFound._id}`)

            return duplicatedUser
        }

        else {

            return false
        }

    }, docRegistration: function(err, docFound){

        var duplicatedDoc = []

        if (err != null) {
            duplicatedDoc.push(true)
            duplicatedDoc.push(500)
            duplicatedDoc.push(error)
            return duplicatedDoc

        } else if (docFound.length != 0) {
            
            duplicatedDoc.push(true)
            duplicatedDoc.push(401)        
            duplicatedDoc.push(`${docFound[0].title}, already exits in address: ${docFound[0].addressId.alias}`)

            return duplicatedDoc
        }

        else {

            return false
        }

    }
    
    
    
}

module.exports = errors;