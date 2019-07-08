var express = require('express');
var router = express.Router();
var cwRouter = require('./cw');

//Define API Connection Endpoints Here

router.use('/cw', (req, res, next) => {
    next();
}, cwRouter);

module.exports = router;