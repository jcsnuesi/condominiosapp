// 'use strict'

// const cron = require('node-cron')
// const Invoice = require('../models/invoice')
// const moment = require('moment')
// const Condominium = require('../models/condominium')

// // Generar facturas automáticamente el primer día de cada mes

// cron.schedule('0 0 1 * *', async () => {

//     const condominiums = await Condominium.find({ status: { $ne: 'inactive' } })
//         .populate("units_ownerId", "email ownerName lastname  phone id_number")
//         .populate("condominiumId", "alias typeOfProperty  phone street_1 street_2 sector_name city province zipcode country socialAreas mPayment status createdBy units_ownerId employees")

//     for (const condominium of condominiums) {

//         const invoices = await Invoice.find({ condominiumId: condominium._id, invoice_status: 'new' })

//         if (invoices.length > 0 && invoices[0].invoice_due < new Date()) {
//             for (const invoice of invoices) {
//                 invoice.invoice_status = 'expired'
//                 await invoice.save()
//             }
//         }

//         const newInvoice = new Invoice({
//             invoice_number: '0',
//             invoice_issue: new Date(),
//             invoice_due: moment().add(1, 'month').toDate(),
//             invoice_amount: condominium.condo_fee,
//             invoice_status: 'new',
//             invoice_description: 'Cuota de mantenimiento',
//             condominiumId: condominium._id,
//             createdBy: '5f8b0f3e5e4e7f1a6c7b1b3c'
//         })

//         await newInvoice.save()
//     }

//     console.log('Invoices created successfully.')
// })
