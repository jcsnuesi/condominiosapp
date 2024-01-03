let bcrypt = require('bcrypt')
let saltRounds = 10;
let Admin = require('../models/admin')


exports.passwordVerified = async function (req, res, next) {

    
    try {
        
        
    
        const current_password = await Admin.findOne({_id:req.body._id})  
     
        if (req.body.new_password) {

            const currentPassword = await bcrypt.compare(req.body.password, current_password.password)

            if (!currentPassword) {


                return res.status(403).send({
                    status: 'error',
                    message: 'Please verify current password is correct!'
                })

            }


            bcrypt.hash(req.body.new_password, saltRounds, (err, hashed) => {
    
    
                if (err) {
    
                    return res.status(500).send({
                        status: 'error',
                        message: err
                    })
                }
                if (!hashed) {
    
                    return res.status(403).send({
                        status: 'error',
                        message: 'New password was not encrypted'
                    })
                }
    
                delete req.body.rnc
                delete req.body.company
                delete req.body.new_password
                req.body.password = hashed

                next()

    
    
            })
    
         

        }else{

            next()

        }


    } catch (error) {

        console.error(error);
        return res.status(500).send({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
  
  

    
  
    
    
   



}