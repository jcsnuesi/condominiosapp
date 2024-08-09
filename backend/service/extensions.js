
checkExtension = {

    confirmExtension: function (req){

        let fileExtensions = []
        
        if (Object.keys(req?.files).length == 0  ) return true
      
        for (const key in req.files) {

            fileExtensions.push(((req.files[key].path).split('.'))[1].toLowerCase()) 
            
             
        }      
       
      
        let AllowExtension = ['jpg', 'jpeg', 'gif', 'png']

        if (AllowExtension.some(ext => fileExtensions.includes(ext))) {
         
            return true
        }else{

            return false
        }
       
      
            

    }
}



module.exports = checkExtension