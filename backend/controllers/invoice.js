'use strict'

var fs = require('fs')
var path = require('path')
var Invoice = require('../models/invoice')
var Condominium = require('../models/condominio')
var moment = require('moment')
const cron = require('node-cron')
var validation = require('validator')


var invoiceController = {

    createInvoice:async function(req, res){

   
        if (req.user.role != 'ADMIN') {
            return res.status(400).send({
                status: 'forbidden',
                message:"No authorized."})
            
        }
        
        var params = req.body

        delete params.paymentDescription
        delete params.invoiceOwner
     
        try {

            var validate_invoice_issue = !validation.isEmpty(params.issueDate)
            var validate_invoice_due = !validation.isEmpty(params.dueDate)
            var validate_invoice_amount = !validation.isEmpty(params.amounts.toString())
      

            
        } catch (error) {
            return res.status(500).send({
                status: 'error',
                message: 'Error in the request. Try again.'
            })
            
        }        

       
        if (validate_invoice_issue &&
            validate_invoice_due &&
            validate_invoice_amount) {


                try {

                   let invoice = [];


                    params.invoiceOwnerSelected.forEach(element => {

                        const invoiceDoc = new Invoice(
                            {
                                invoice_issue: new Date(params.issueDate),
                                invoice_due: new Date(params.dueDate),
                                invoice_amount: params.amounts,
                                invoice_description: params.paymentDescriptionSelected[0].value,
                                condominiumId: params.condominiumId,
                                ownerId: element.value,
                                createdBy: req.user.sub
                            }
                        )

                        invoice.push(invoiceDoc)

                    });



                    // guardo la factura

                    await Invoice.insertMany(invoice)

                    return res.status(200).send({
                        status: 'success',
                        message: 'Invoice created successfully.',
                        invoice: invoice
                    })
                    
                } catch (
                    error
                ) {
                    
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error creating invoice. Try again.',
                        error_found: error
                    })
                }
             

          
        }else{

            return res.status(400).send({

                status: 'error',
                message: 'Data is missing. Try again.'
            })
        }
        

    },
    generateInvoice: async function(req, res){
            
            // Generar facturas automáticamente el primer día de cada mes
         var params = req.body
        const condominiums = await Condominium.findOne({ 
            _id: params.condominiumId, 
            status: { $ne: 'inactive' } 
        }).populate("units_ownerId", "email ownerName lastname  phone id_number")
           
        const resInfo = new Array(condominiums)

        try {
            
            for (const condominium of resInfo) {
    
                const invoices = await Invoice.find({ condominiumId: condominium._id, invoice_status: 'new' })
    
                if (invoices.length > 0 && new Date(invoices[0].invoice_due) < new Date()) {
                    for (const invoice of invoices) {
                        invoice[0].invoice_status = 'expired'
                        await invoice.save()
                    }
                }
                
          
                condominium.units_ownerId.forEach(async (element) => {

                
                    const newInvoice = new Invoice({

                        invoice_issue: new Date(),
                        invoice_due: moment().add(1, 'month').toDate(),
                        invoice_amount: condominium.mPayment,
                        invoice_status: 'new',
                        invoice_description: condominium.description,
                        condominiumId: condominium._id,
                        createdBy: req.user.sub,
                        ownerId: element._id
                    })
                    await newInvoice.save()
                    

                })
                    
        
             
             
            }
        } catch (
            error
        ) {
            return res.status(500).send({
                status: 'error',
                message: 'Invoices not generated, try again.',

            })
            
        }


        return res.status(200).send({
            status: 'success',
            message: 'Invoices generated successfully.'
        })
    },
    getInvoices:function(req, res){
        var userId = req.params.id

        Invoice.find({ ownerId: userId })
            .populate('condominiumId','alias phone street_1 street_2 sector_name city province country')
            .populate('ownerId', 'ownerName lastname email phone id_number propertyDetails')
        .exec((err, invoices) => {
          
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error in the request. Try again.'
                })
            }

            if (!invoices) {
                return res.status(404).send({
                    status: 'error',
                    message: 'There are no invoices to show.'
                })
            }

            return res.status(200).send({
                status: 'success',
                invoices
            })
        })
    },
}


module.exports = invoiceController