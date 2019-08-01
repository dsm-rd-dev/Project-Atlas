var express = require('express');
var router = express.Router();
const cw = require('../../connectors/cw');

module.exports = (db, log, passport) => {
    var cwRouter = require('./cw/cw');

    //Auth middleware for API Token
    router.use((req, res, next) => {
        var token = req.get("Authorization");
        if (token == null) {
            res.status(401).end();
        } else if(token.startsWith("app+")) { //App
            db.App.findOne({
                where: {
                    key: token.substr(4)
                },
                include: [{
                    model: db.Role
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
            console.log("Authorizing standard user");
            passport.authenticate('jwt', {session: false}, (error, user) => {
                if(error) next(error);
                if(user != null){
                console.log(error);
                req.user = user;
                req.role = JSON.parse(user.Role.definition);
                if(req.role.disabled) {
                    res.status(401).end();
                }else{
                    next();
                }
            }else{
                res.status(401).end();
            }
            })(req, res, next);
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