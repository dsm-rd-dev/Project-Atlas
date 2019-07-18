var express = require('express');
var router = express.Router();

var ticketRouter = require('./endpoints/ticket');
var companyRouter = require('./endpoints/company');

router.use((req, res, next) => {
    if(req.role.admin || req.role.cw){
        next();
    }else{
        res.status(401).end();
    }
});

//Define Endpoint Routes Here
router.use('/ticket', (req, res, next) => {
    if(req.role.admin || req.role.cw.ticket){
        next();
    }else{
        res.status(401).end();
    }
    
}, ticketRouter);

router.use('/company', (req, res, next) => {
    if(req.role.admin || req.role.cw.company){
        next();
    }else{
        res.status(401).end();
    }
}, companyRouter);

module.exports = router;