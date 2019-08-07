var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../config/config.json');

module.exports = (db, log, passport) => {

    

    //Middleware for logged in
    function loggedIn(req, res, next) {
        var token = req.get("Authorization");
        if (token == null) {
            res.status(401).end();
        } else {
            passport.authenticate('jwt', {
                session: false
            }, (error, user) => {
                if (error) res.send(error).end();
                if (user) {
                    req.user = user;
                    req.role = JSON.parse(user.Role.definition);
                    if (req.role.disabled) {
                        res.status(401).end();
                    } else {
                        next();
                    }
                } else {
                    res.status(401).end();
                }
            })(req, res, next);
        }
    }

    //Admin middleware
    function admin(req, res, next) {
        if (req.role.admin) {
            next();
        } else {
            res.status(401).end();
        }
    }

    var requireAdmin = [loggedIn, admin];

    /**
     * @swagger
     * /auth/login:
     *  post:
     *    tags: [User]
     *    description: Request JWT Token
     *    parameters:
     *      - in: body
     *        required: true
     *        schema:
     *            $ref: '#/components/LoginRequest'
     *    responses:
     *      '200':
     *          description: Login Successful
     *          schema:
     *              $ref: '#/components/LoginResponse'
     *      '401':
     *          description: Bad Username/Password
     */
    router.post('/login', (req, res, next) => {
        db.User.findOne({
            where: {
                username: req.body.username
            }
        }).then(user => {
            if (user != null) {
                user.validPassword(req.body.password).then(valid => {
                    if (valid) {
                        const token = jwt.sign(user.toJSON(), config.secret, {
                            expiresIn: 604000
                        });

                        res.send({
                            auth: 'JWT ' + token
                        });
                    } else res.status(401).end();
                })
            } else {
                res.status(401).end();
            }
        }).catch(next);
    });

    /**
     * @swagger
     * /auth/app:
     *  post:
     *    tags: [App]
     *    description: Create a new App
     *    parameters:
     *      - in: body
     *        required: true
     *        schema:
     *          $ref: '#/components/NewApp'
     *    responses:
     *      '200':
     *          description: Successfully Created
     *          schema:
     *              $ref: '#/components/App'
     *      '401':
     *          description: 'Unauthroized'
     */
    router.post('/app', requireAdmin, (req, res, next) => {
        const newApp = db.App.build({
            name: req.body.name,
            role_id: req.body.role_id
        });
        newApp.key = newApp.generateUUID();
        newApp.save().then(app => {
            res.send(app);
        }).catch(next);
    })

    /**
     * @swagger
     * /auth/app:
     *  get:
     *      tags: [App]
     *      description: Get All Apps
     *      responses:
     *          '200':
     *              description: Success
     *              schema:
     *                  type: array
     *                  items:
     *                      $ref: '#/components/App'
     *          '401':
     *               description: 'Unauthroized'
     */
    router.get('/app', requireAdmin, (req, res, next) => {
        db.App.findAll({
            include: [{
                model: db.Role
            }]
        }).then(apps => {
            res.send(apps);
        }).catch(next);
    });

    /**
     * @swagger
     * /auth/app/<id>:
     *  get:
     *      tags: [App]
     *      description: Get Specific App
     *      parameters:
     *          - in: path
     *            name: id
     *            required: true
     *            schema:
     *              type: integer
     *            description: App ID
     *      responses:
     *          '200':
     *              description: Successfully Found
     *              schema:
     *                  $ref: '#/components/App'
     *          '404':
     *              description: 'Not Found'
     *          '401':
     *              description: 'Unauthroized'
     */
    router.get('/app/:id', requireAdmin, (req, res, next) => {
        db.App.findOne({
            where: {
                id: req.params.id
            },
            include: [{
                model: db.Role
            }]
        }).then(apps => {
            res.send(apps);
        }).catch(next);
    });

    /**
     * @swagger
     * /auth/app/<id>:
     *  patch:
     *      tags: [App]
     *      description: Update App
     *      parameters:
     *          - in: path
     *            name: id
     *            required: true
     *            schema:
     *              type: integer
     *            description: App ID
     * 
     *          - in: body
     *            required: true
     *            schema:
     *              $ref: '#/components/NewApp'
     *      responses:
     *          '200':
     *              description: Successfully Updated
     *              schema:
     *                  $ref: '#/components/App'
     *          '401':
     *              description: 'Unauthroized'
     */
    router.patch('/app/:id', requireAdmin, (req, res, next) => {
        db.App.findOne({
            where: {
                id: req.params.id
            }
        }).then(app => {
            if ('name' in req.body) app.name = req.body.name;
            if ('role_id' in req.body) app.role_id = req.body.role_id;
            app.save().then(() => {
                res.send(app);
            }).catch(err => {
                res.status(500).send(err).end();
            });
        }).catch(next);
    })

    /**
     * @swagger
     * /auth/role:
     *  post:
     *      tags: [Role]
     *      description: Create New Role
     *      parameters:
     *          - in: body
     *            required: true
     *            schema:
     *              $ref: '#/components/Role'
     *      responses:
     *          '200':
     *              description: Successfully Created
     *              schema:
     *                  $ref: '#/components/Role'
     *          '401':
     *              description: 'Unauthroized'
     */
    router.post('/role', requireAdmin, (req, res, next) => {
        const newRole = db.Role.build({
            name: req.body.name,
            definition: req.body.definition
        });
        newRole.save().then(role => {
            res.send(role);
        }).catch(next);
    });

    /**
     * @swagger
     * /auth/role:
     *  get:
     *      tags: [Role]
     *      description: Get All Roles
     *      responses:
     *          '200':
     *              description: Success
     *              schema:
     *                  type: array
     *                  items:
     *                      $ref: '#/components/Role'
     *          '401':
     *               description: 'Unauthroized'
     */
    router.get('/role', requireAdmin, (req, res, next) => {
        db.Role.findAll().then(roles => {
            res.send(roles);
        }).catch(next);
    })

    /**
     * @swagger
     * /auth/role/<id>:
     *  get:
     *      tags: [Role]
     *      description: Get Specific Role
     *      parameters:
     *          - in: path
     *            name: id
     *            required: true
     *            schema:
     *              type: integer
     *            description: Role ID
     *      responses:
     *          '200':
     *              description: Successfully Found
     *              schema:
     *                  $ref: '#/components/Role'
     *          '404':
     *              description: 'Not Found'
     *          '401':
     *              description: 'Unauthroized'
     */
    router.get('/role/:id', requireAdmin, (req, res, next) => {
        db.Role.findOne({
            where: {
                id: req.params.id
            }
        }).then(role => {
            res.send(role);
        }).catch(next);
    });

    /**
     * @swagger
     * /auth/role/<id>:
     *  patch:
     *      tags: [Role]
     *      description: Update Role
     *      parameters:
     *          - in: path
     *            name: id
     *            required: true
     *            schema:
     *              type: integer
     *            description: Role ID
     *          - in: body
     *            required: true
     *            schema:
     *              $ref: '#/components/Role'
     *      responses:
     *          '200':
     *              description: Successfully Created
     *              schema:
     *                  $ref: '#/components/Role'
     *          '401':
     *              description: 'Unauthroized'
     */
    router.patch('/role/:id', requireAdmin, (req, res, next) => {
        db.Role.findOne({
            where: {
                id: req.params.id
            }
        }).then(role => {
            if ('name' in req.body) role.name = req.body.name;
            if ('definition' in req.body) role.definition = req.body.definition;
            role.save().then(role => {
                res.send(role);
            }).catch(err => {
                res.status(500).send(err).end();
            });
        }).catch(next);
    })

    /**
     * @swagger
     * /auth/user:
     *  post:
     *      tags: [User]
     *      description: Create New User
     *      parameters:
     *          - in: body
     *            required: true
     *            schema:
     *              $ref: '#/components/NewUser'
     *      responses:
     *          '200':
     *              description: Successfully Created
     *              schema:
     *                  $ref: '#/components/User'
     *          '401':
     *              description: Unauthorized
     */
    router.post('/user', requireAdmin, (req, res, next) => {
        const newUser = db.User.build({
            username: req.body.username,
            role_id: req.body.role_id
        });
        console.log(req.body.password)
        newUser.generateHash(req.body.password).then(hash => {
            newUser.password = hash;
            newUser.save().then(user => {
                res.send({
                    message: "User created successfully"
                });
            }).catch(err => {
                console.log(err);
                res.status(500).send(err).end();
            })
        }).catch(next);
    })

    /**
     * @swagger
     * /auth/user:
     *  get:
     *      tags: [User]
     *      description: Get All Users
     *      responses:
     *          '200':
     *              description: Success
     *              schema:
     *                  type: array
     *                  items:
     *                      $ref: '#/components/User'
     *          '401':
     *               description: 'Unauthroized'
     */
    router.get('/user', requireAdmin, (req, res, next) => {
        db.User.findAll({
            attributes: ['username', 'id'],
            include: [{
                model: db.Role
            }]
        }).then(users => {
            res.send(users);
        }).catch(next);
    });

    /**
     * @swagger
     * /auth/user/<id>:
     *  get:
     *      tags: [User]
     *      description: Get Specific User
     *      parameters:
     *          - in: path
     *            name: id
     *            required: true
     *            schema:
     *              type: integer
     *            description: User ID
     *      responses:
     *          '200':
     *              description: Successfully Found
     *              schema:
     *                  $ref: '#/components/User'
     *          '404':
     *              description: 'Not Found'
     *          '401':
     *              description: 'Unauthroized'
     */
    router.get('/user/:id', loggedIn, (req, res, next) => {
        if (req.role.admin || req.user.id == req.params.id) {
            db.User.findOne({
                where: {
                    id: req.params.id
                },
                include: [{
                    model: db.Role
                }]
            }).then(user => {
                res.send(user);
            }).catch(next);
        }
    });

    /**
     * @swagger
     * /auth/user/<id>:
     *  patch:
     *      tags: [User]
     *      description: Update User
     *      parameters:
     *          - in: path
     *            name: id
     *            required: true
     *            schema:
     *              type: integer
     *            description: User ID
     *          - in: body
     *            required: true
     *            schema:
     *              $ref: '#/components/User'
     *      responses:
     *          '200':
     *              description: Successfully Updated
     *              schema:
     *                  $ref: '#/components/User'
     *          '401':
     *              description: Unauthorized
     */
    router.patch('/user/:id', requireAdmin, (req, res, next) => {
        db.User.findOne({
            where: {
                id: req.params.id
            }
        }).then(user => {
            if ('username' in req.body) user.username = req.body.username;
            if ('role_id' in req.body) user.role_id = req.body.role_id;

            user.save().then(user => {
                res.send(user);
            }).catch(err => {
                console.log(err);
                res.status(500).send(err).end();
            });
        }).catch(next);
    });

    /**
     * @swagger
     * /auth/me:
     *  get:
     *      tags: [User]
     *      description: Get JWT user
     */
    router.get('/me', loggedIn, (req, res, next) => {
        res.send(req.user);
    });
    return router;


    
}