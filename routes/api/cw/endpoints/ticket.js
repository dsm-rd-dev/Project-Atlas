var express = require('express');
var router = express.Router();

//Get Ticket By ID
router.get('/:id', (req, res, next) => {
    req.cw.getTicketById(req.params.id).then(results => {
        res.set('Content-Type', 'application/json');
        res.send(results);
    }).catch(error => {
        res.send(error);
    });
});

//Create Ticket
router.post('/', (req, res, next) => {
    req.cw.createTicket(req.body.summary, req.body.companyId).then(results => {
        res.set('Content-Type', 'application/json');
        res.send(results);
    }).catch(error => {
        res.send(error);
    })
});

module.exports = router;