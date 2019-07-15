var express = require('express');
var router = express.Router();

//TODO Dynamic router allocation
var ticketRouter = require('./endpoints/ticket');

//Define Endpoint Routes Here
router.use('/ticket', (req, res, next) => {
    next();
}, ticketRouter);

module.exports = router;