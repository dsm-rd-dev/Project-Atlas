var express = require('express');
var router = express.Router();

//Get Ticket By ID
router.get('/:id', (req, res, next) => {
    req.cw.getTicketById(req.params.id).then(results => {
        res.set('Content-Type', 'application/json');
        res.send(results);
    }).catch(error => {
        req.log.errFail(error);
        res.status(500);
        res.send(error);
    });
});

//Create Ticket
router.post('/', (req, res, next) => {
    req.cw.createSupportTicket(req.body.summary, req.body.companyName, req.body.boardId).then(results => {
        res.set('Content-Type', 'application/json');
        res.send(results);
    }).catch(error => {
        req.log.errFail(error);
        res.status(500);
        res.send(error);
    })
});

module.exports = router;