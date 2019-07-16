var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    req.cw.getCompanies().then(comps => {
        res.send(comps);
    }).catch(error => {
        res.send(error);
    });
});

router.get('/:id', (req, res, next) => {
    req.cw.getCompanyById(req.params.id).then(comp => {
        res.send(comp);
    }).catch(err => {
        res.send(err);
    });
});

router.get('/:id/tickets', (req, res, next) => {
    req.cw.getCompanyTickets(req.params.id).then(tickets => {
        res.send(tickets);
    }).catch(err => {
        res.send(err);
    });
});

router.get('/:name/lookup', (req, res, next) => {
    req.cw.getCompanyID(req.params.name).then(id => {
        res.send({"id": id});
    }).catch(err => {
        res.send(err);
    })
})

module.exports = router;