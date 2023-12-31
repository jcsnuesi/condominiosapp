'use strict'

var validator = require('validator')
var Cxc = require('../models/cxc')
var ExceptionHandler = require('../error/errorHandler')
var Owner = require('../models/owners')
var Address = require('../models/address')



var CxcController = {

    prueba:function(req, res){

        return res.send({message:"probado!!"})
    },

    generateInvoice: async function(req, res){
        // Paramatros para la factura
       //  generar fecha de corte

        var userId = await Owner.find()

        var ownerId = userId.map((value, index) => {
            var ids = value.id
            return ids
        })

        
        Address.find({ "apartmentInfo.ownerId": ownerId[1] },(err, found) => {
            
        
            // console.log(found[0].apartmentInfo)
            found[0].apartmentInfo.forEach((element,index, arr) =>  {
                // console.log(element)
                console.log(element.invoiceIssueDay)
                // console.log(element.apartmentInfo[index].invoiceIssueDay) 

            })
            
           


        })

        return
        var addressId =  idAddress.map((value, index) => {
            var ids = value.id
            return ids
        })


    
       Owner.findOne(
        {"address._id": addressId[1]},(err, ownerFound) => {

               const comentarioEncontrado = ownerFound.address.find(comentario =>
                   comentario._id.toString() === comentarioId
               );

               console.log(comentarioEncontrado) 
        
       })

       return

        // id address - id owner
        // addressId_1, addressId_2 -> owner_id_1
    
        var owners = ow.map((value, index) => {
            
            var ids = value.address
           
            return ids
        })
        owners.forEach((element,index) => {

            // console.log(index)
            // console.log(element[index])

         
            if (element[index] != null && element[index] != undefined) {
               
                console.log(element[index].length) 
                
               
            }
        });

      
     
        return
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            
        }
        Cxc.find({ _id: owners })
        
         return
        Owner.find(async(err, found)=>{

            /* Parametros:
          
            idAddress
            Owner
            status
            PendingBalance
            TotalPendingBalance
            dateIssue
            dateOverDue
            qtyOfDaysOverDue

            1- Comprobar que no tiene facturas pendiente
            2- Comparar las fechas 
            3- Generar la factura por owner

            */

           

            var invoiceDate = new Date();
            var year = invoiceDate.getFullYear();
            var day = invoiceDate.getDate();
            const month = (invoiceDate.getMonth()+1);

            let milisegundosDia = 24 * 60 * 60 * 1000;       
            

            for (let index = 0; index < found.length; index++) {

                var customerDayPay = found[index].invoiceIssueDay;

                // var milisegundosTranscurridos = Math.abs(currentDate - currentToCompare)
                // var diasTranscurridos =  Math.round(milisegundosTranscurridos / milisegundosDia)               

                var invoiceFound = await Cxc.find({ customer: found[index]._id })
            
                if (invoiceFound.length > 0) {

                    var invoiceD = new Date(invoiceFound.issueDate)
                    var currentDate = new Date(`${month}/${invoiceD.getDate()}/${year}`)
                    var currentToCompare = new Date(`${month}/${customerDayPay}/${year}`)

                    var milisegundosTranscurridos = currentDate - currentToCompare
                    var diasTranscurridos = Math.round(milisegundosTranscurridos / milisegundosDia)

                    const numeroNegativo = diasTranscurridos < 0;

                    
                    
                }else{

                   //Crear invoice

                    var cxc = new Cxc()
                    cxc.type_of_payment = params.type_of_payment
                    cxc.customer = req.user.sub                    
                    cxc.PendingBalance = await Address.find({ _id: found.address.address })
                    cxc.issueDate = params.type_of_payment
                    cxc.dateOverDue = params.type_of_payment
                    cxc.qtyOfDaysOverDue = params.type_of_payment
                    
                 
                    

                   //Asignar al owener

                    
                }
            
               

                
            }
            
         
       

            
            return res.send({
                diasTranscurridos
            })
        })
       
    }, verifyDate:function(){

    }
}

module.exports = CxcController;
