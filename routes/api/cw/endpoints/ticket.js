var express = require('express');
var router = express.Router();

//Get Ticket By ID
router.get('/:id', (req, res, next) => {
    if (req.role.admin || req.role.cw.ticket.includes("read")) {
        req.cw.getTicketById(req.params.id).then(results => {
            res.set('Content-Type', 'application/json');
            res.send(results);
        }).catch(error => {
            req.log.errFail(error);
            res.status(500);
            res.send(error);
        });
    } else {
        res.status(401).end();
    }
});

//Create Ticket
router.post('/', (req, res, next) => {
    if (req.role.admin || req.role.cw.ticket.includes("write")) {
        req.cw.createSupportTicket(req.body.summary, req.body.companyName, req.body.boardId).then(results => {
            res.set('Content-Type', 'application/json');
            res.send(results);
        }).catch(error => {
            req.log.errFail(error);
            res.status(500);
            res.send(error);
        })
    } else {
        res.status(401).end();
    }
});

module.exports = router;