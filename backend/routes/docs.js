'use strict'

let express = require('express')
let router =  express.Router()
let DocsController = require('../controllers/docs')

let multyParty = require('connect-multiparty')
let md_uplaod = multyParty({ uploadDir: './uploads/docs' })

let md_auth = require('../middleware/auth')


// GET 

router.get('/getDirectory/:id', md_auth.authenticated, DocsController.getDocsDirectoryByAddressId)

router.get('/getDocsByName/:id/:file', md_auth.authenticated, DocsController.openFileByPath)

// POST

router.post('/createDoc', [md_auth.authenticated, md_uplaod], DocsController.createDoc)

// DELETE

router.delete('/deleteDoc', md_auth.authenticated, DocsController.deleteFileByName)


module.exports = router
