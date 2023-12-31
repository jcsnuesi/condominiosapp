
exports.authorization = function (req, res, next) {

    let params = req.user.role
 
    if (params != 'SUPERUSER') {
        
        return res.status(403).send({
            status: "forbidden",
            message: "You are not authorized"
        })
    }
   
    next();

}