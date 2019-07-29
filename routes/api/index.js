var express = require('express');
var router = express.Router();
const cw = require('../../connectors/cw');

module.exports = (db, log) => {
    var cwRouter = require('./cw/cw');

    //Auth middleware for API Token
    router.use((req, res, next) => {
        var token = req.get("Authorization");
        if (token == null) {
            res.status(401).end();
        } else if(token.startsWith("app+")) { //App
            db.sequelize.models.App.findOne({
                where: {
                    key: token.substr(4)
                },
                include: [{
                    model: db.sequelize.models.Role
                }]
            }).then(app => {
                if(app != null){
                    req.role = JSON.parse(app.Role.definition);
                    req.user = app;
                    if(req.role.disabled){
                        res.status(401).end();
                    }else{
                        next();
                    }
                }else{
                    res.status(401).end();
                }
            }).catch(next);
        } else {    //Standard User
            db.sequelize.models.User.findOne({
                where: {
                    api_token: token
                },
                include: [{
                    model: db.sequelize.models.Role
                }]
            }).then(user => {
                if (user != null) {
                    req.role = JSON.parse(user.Role.definition);
                    req.user = user;
                    if(req.role.disabled){
                        res.status(401).end();
                    }else{
                        next();
                    }
                } else {
                    res.status(401).end();
                }
            }).catch(next);
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