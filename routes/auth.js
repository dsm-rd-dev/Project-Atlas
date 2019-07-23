var express = require('express');
var router = express.Router();

module.exports = (db, log) => {

    const User = db.sequelize.models.User;
    const Role = db.sequelize.models.Role;

    function admin(req, res, next) {
        User.findOne({
            where: {
                api_token: req.get('Authorization')
            },
            include: [{
                model: Role
            }]
        }).then(user => {
            if(user != null){
                if(JSON.parse(user.Role.definition).admin){
                    next();
                }else{
                    res.status(401).end();
                }
            }else{
                res.status(401).end();
            }
        }).catch(err => {
            console.log(err);
            res.status(500).send(err).end();
        })
    }

    router.post('/login', (req, res, next) => {
        User.findOne({
            where: {
                username: req.body.username
            }
        }).then(user => {
            if (user != null) {
                user.validPassword(req.body.password).then(valid => {
                    if (valid) {
                        //Generate random API Token
                        var token = Math.random().toString(36).slice(-8);

                        //Store with User
                        user.update({api_token: token}).then(user => {

                            //Return to User
                            res.send({
                                "auth": user.api_token
                            });
                        })
                    } else res.status(401).send({
                        "code": 401,
                        "message": "Incorrect Username/Password"
                    }).end();
                })
            } else {
                res.status(401).send({
                    "code": 401,
                    "message": "Incorrect Username/Password"
                }).end();
            }
        }).catch(err => {
            log.errFail(err.message);
            res.status(500).send(err).end();
        })
    });

    router.get('/users', admin, (req, res, next) => {
        User.findAll({
            attributes: [ 'username' ],
            include: [{
                model: Role
            }]
        }).then(users => {
            res.send(users);
        }).catch(err => {
            res.status(500).send(err).end();
        })
    });
    return router;
}