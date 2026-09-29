'use strict'

let express = require('express')
let TaskController = require('../controllers/task')

let md_auth = require('../middleware/auth')
let router =  express.Router()

// GET

router.get('/prueba2023', TaskController.prueba)
router.get('/findTask/:id', md_auth.authenticated, TaskController.getTask)
router.get('/findTasks', md_auth.authenticated, TaskController.getTasks)

// POST

router.post('/createTask', md_auth.authenticated, TaskController.createTask)

// PUT

router.put('/updateTask', md_auth.authenticated, TaskController.taskupdate)

// DELETE


module.exports = router
