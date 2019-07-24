var express = require('express');
var router = express.Router();

module.exports = (db, log) => {

    const User = db.sequelize.models.User;
    const Role = db.sequelize.models.Role;
    const App = db.sequelize.models.App;

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
                    if(req.role.disabled){
                        res.status(401).end();
                    }else{
                        next();
                    }
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

    router.get('/app', requireAdmin, (req, res, next) => {
        App.findAll({
            include: [{
                model: Role
            }]
        }).then(apps => {
            res.send(apps);
        }).catch(err => {
            res.status(500).send(err).end();
        })
    });

    router.get('/app/:id', requireAdmin, (req, res, next) => {
        App.findOne({
            where: {
                id: req.params.id
            },
            include: [{
                model: Role
            }]
        }).then(apps => {
            res.send(apps);
        }).catch(err => {
            res.status(500).send(err).end();
        })
    });

    router.patch('/app', requireAdmin, (req, res, next) => {
        App.findOne({
            where: {
                id: req.body.id
            }
        }).then(app => {
            if('name' in req.body) app.name = req.body.name;
            if('role_id' in req.body) app.role_id = req.body.role_id;
            app.save().then(() => {
                res.send(app);
            }).catch(err => {
                res.status(500).send(err).end();
            });
        }).catch(err => {
            res.status(500).send(err).end();
        })
    })

    router.get('/role', requireAdmin, (req, res, next) => {
        Role.findAll().then(roles => {
            res.send(roles);
        }).catch(err => {
            res.status(500).send(err).end();
        })
    })

    router.get('/role/:id', requireAdmin, (req, res, next) => {
        Role.findOne({
            where: {
                id: req.params.id
            }
        }).then(role => {
            res.send(role);
        }).catch(err => {
            res.status(500).send(err).end();
        });
    });

    router.post('/role', requireAdmin, (req, res, next) => {
        const newRole = Role.build({ name: req.body.name, definition: req.body.definition });
        newRole.save().then(role => {
            res.send(role);
        }).catch(err => {
            res.status(500).send(err).end();
        });
    });

    router.post('/user', requireAdmin, (req, res, next) => {
        const newUser = User.build({ username: req.body.username, role_id: req.body.role_id });
        console.log(req.body.password)
        newUser.generateHash(req.body.password).then(hash => {
            newUser.password = hash;
            newUser.save().then(user => {
                res.send({message: "User created successfully"});
            }).catch(err => {
                console.log(err);
                res.status(500).send(err).end();
            })
        }).catch(err => {
            console.log(err);
            res.status(500).send(err).end();
        })
    })

    router.get('/user', requireAdmin, (req, res, next) => {
        User.findAll({
            attributes: [ 'username', 'id' ],
            include: [{
                model: Role
            }]
        }).then(users => {
            res.send(users);
        }).catch(err => {
            res.status(500).send(err).end();
        })
    });

    router.get('/user/:id', loggedIn, (req, res, next) => {
        if(req.role.admin || req.user.id == req.params.id){
            User.findOne({
                where: {
                    id: req.params.id
                },
                include: [{
                    model: Role
                }]
            }).then(user => {
                res.send(user);
            }).catch(err => {
                res.status(500).send(err).end();
            })
        }
    });

    router.patch('/user', requireAdmin, (req, res, next) => {
        User.findOne({
            where: {
                id: req.body.id
            }
        }).then(user => {
            if('username' in req.body) user.username = req.body.username;
            if('role_id' in req.body) user.role_id = req.body.role_id;

            user.save().then(user => {
                res.send(user);
            }).catch(err => {
                console.log(err);
                res.status(500).send(err).end();
            });
        }).catch(err => {
            console.log(err);
            res.status(500).send(err).end();
        })
    });

    router.get('/me', loggedIn, (req, res, next) => {
        res.send(req.user);
    });
    return router;
}