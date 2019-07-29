var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    if (req.role.admin || req.role.cw.company.includes("read")) {
        req.cw.getCompanies(req.query.page, req.query.pageSize, req.query.order, req.query.search).then(comps => {
            res.send(comps);
        }).catch(next);
    } else {
        res.status(401).end();
    }
});

router.get('/:id', (req, res, next) => {
    if (req.role.admin || req.role.cw.company.includes("read")) {
        req.cw.getCompanyById(req.params.id).then(comp => {
            res.send(comp);
        }).catch(next);
    } else {
        res.status(401).end();
    }
});

router.get('/:id/tickets', (req, res, next) => {
    if (req.role.admin || req.role.cw.company.includes("read")) {
        req.cw.getCompanyTickets(req.params.id, req.query.page, req.query.pageSize, req.query.search).then(tickets => {
            res.send(tickets);
        }).catch(next);
    } else {
        res.status(401).end();
    }
});

router.get('/:name/lookup', (req, res, next) => {
    if (req.role.admin || req.role.cw.company.includes("read")) {
        req.cw.getCompanyID(req.params.name).then(id => {
            res.send({
                "id": id
            });
        }).catch(next);
    } else {
        res.status(401).end();
    }
})

module.exports = router;