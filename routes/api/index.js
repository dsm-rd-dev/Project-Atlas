var express = require('express');
var router = express.Router();
const cw = require('../../connectors/cw');



module.exports = (User) => {
    //TODO dynamic router allocation
    var cwRouter = require('./cw/cw');

    //Auth middleware for API Token
    router.use((req, res, next) => {
        var token = req.get("Authorization");
        console.log("Auth Token: " + token);
        User.findOne({where: {api_token: token}}).then(user => {
            if(user != null){
                next();
            }else{
                res.status(401).end();
            }
        }).catch(err => {
            res.status(500).end();
        });
    });

    //Define API Connection Endpoints Here
    router.use('/cw', (req, res, next) => {
        req.cw = cw;
        next();
    }, cwRouter);

    return router;
}