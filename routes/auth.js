var express = require('express');
var router = express.Router();

module.exports = (User, log) => {
    
    //TODO Login Route
    router.get('/login', (req, res, next) => {

    });

    //TODO Register Route
    router.get('/createUser', (req, res, next) => {

    });

    return router;
}