var express = require('express');
var router = express.Router();

var ticketRouter = require('./endpoints/ticket');
var companyRouter = require('./endpoints/company');

//Define Endpoint Routes Here
router.use('/ticket', (req, res, next) => {
    next();
}, ticketRouter);

router.use('/company', (req, res, next) => {
    next();
}, companyRouter)

module.exports = router;