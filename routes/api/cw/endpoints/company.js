var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    if (req.role.admin || req.role.cw.company.includes("read")) {
        req.cw.getCompanies(req.query.page, req.query.pageSize, req.query.order, req.query.search).then(comps => {
            res.send(comps);
        }).catch(error => {
            req.log.errFail(error);
            res.status(500);
            res.send(error);
        });
    } else {
        res.status(401).end();
    }
});

router.get('/:id', (req, res, next) => {
    if (req.role.admin || req.role.cw.company.includes("read")) {
        req.cw.getCompanyById(req.params.id).then(comp => {
            res.send(comp);
        }).catch(err => {
            req.log.errFail(error);
            res.status(500);
            res.send(err);
        });
    } else {
        res.status(401).end();
    }
});

router.get('/:id/tickets', (req, res, next) => {
    if (req.role.admin || req.role.cw.company.includes("read")) {
        req.cw.getCompanyTickets(req.params.id, (req.query.page ? req.query.page : 1)).then(tickets => {
            res.send(tickets);
        }).catch(err => {
            req.log.errFail(error);
            res.status(500);
            res.send(err);
        });
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
        }).catch(err => {
            req.log.errFail(error);
            res.status(500);
            res.send(err);
        })
    } else {
        res.status(401).end();
    }
})

module.exports = router;