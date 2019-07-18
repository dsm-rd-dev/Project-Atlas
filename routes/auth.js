const bcrypt = require('bcryptjs');
var express = require('express');
var router = express.Router();

module.exports = (db, log) => {
    router.post('/login', (req, res, next) => {
        db.models.User.findOne({
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
    return router;
}