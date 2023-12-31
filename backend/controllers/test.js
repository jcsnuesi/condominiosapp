var { Invoice, generate } =  require('./cxc')
var Cxc = require('../models/cxc')
var owner = require('../models/owners')



console.log(Invoice(Cxc, owner))
console.log(generate())