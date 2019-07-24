var express = require('express');
var router = express.Router();

module.exports = (db, log) => {

    const User = db.sequelize.models.User;
    const Role = db.sequelize.models.Role;

    function loggedIn(req, res, next) {
        var token = req.get("Authorization");
        if (token == null) {
            res.status(401).end();
        } else {
            db.sequelize.models.User.findOne({
                where: {
                    api_token: token
                },
                attributes: {
                    exclude: ['password']
                },
                include: [{
                    model: db.sequelize.models.Role
                }]
            }).then(user => {
                if (user != null) {
                    req.role = JSON.parse(user.Role.definition);
                    req.user = user;
                    next();
                } else {
                    res.status(401).end();
                }
            }).catch(err => {
                console.log(err);
                res.status(500).end();
            });
        }
    }

    function admin(req, res, next) {
        if(req.role.admin) {
            next();
        }else{
            res.status(401).end();
        }
    }

    var requireAdmin = [loggedIn, admin];

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

    router.get('/users', requireAdmin, (req, res, next) => {
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

    router.get('/user/:id', requireAdmin, (req, res, next) => {
        if(req.role.admin || req.user.id == req.params.id){
            User.findOne({
                where: {
                    id: req.params.id
                }
            }).then(user => {
                res.send(user);
            }).catch(err => {
                res.status(500).send(err).end();
            })
        }
    });

    router.get('/user', loggedIn, (req, res, next) => {
        res.send(req.user);
    });
    return router;
}