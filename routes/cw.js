var express = require('express');
var router = express.Router();
const cw = require('../connectors/cw');

//Define Endpoint Routes Here

router.get('/ticket/:id', (req, res, next) => {
    cw.getTicketById(req.params.id).then(results => {
        res.send(results);
    }).catch(error => {
        res.send(error);
    });
});

router.post('/ticket', (req, res, next) => {
    cw.createTicket(req.body.summary, req.body.companyId).then(results => {
        res.send(results);
    }).catch(error => {
        res.send(error);
    })
})

module.exports = router;