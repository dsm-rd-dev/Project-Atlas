var express = require('express');
var router = express.Router();
const cw = require('../../connectors/cw');

module.exports = (User, log) => {
    var cwRouter = require('./cw/cw');

    //Auth middleware for API Token
    router.use((req, res, next) => {
        var token = req.get("Authorization");
        if (token == null) {
            res.status(401).end();
        } else {
            User.findOne({
                where: {
                    api_token: token
                }
            }).then(user => {
                if (user != null) {
                    next();
                } else {
                    res.status(401).end();
                }
            }).catch(err => {
                res.status(500).end();
            });
        }
    });

    //Define API Connection Endpoints Here
    router.use('/cw', (req, res, next) => {
        req.cw = cw;
        req.log = log;
        next();
    }, cwRouter);

    return router;
}