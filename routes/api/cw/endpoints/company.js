var express = require('express');
var router = express.Router();

/**
 * @swagger
 * /api/cw/company:
 *  get:
 *      tags: [Company]
 *      description: Get All Companies
 *      responses:
 *          '200':
 *              description: Success
 *              schema:
 *                  type: array
 *                  items:
 *                      $ref: '#/components/Company'
 */
router.get('/', (req, res, next) => {
    if (req.role.admin || req.role.cw.company.includes("read")) {
        req.cw.getCompanies(req.query.page, req.query.pageSize, req.query.order, req.query.search).then(comps => {
            res.send(comps);
        }).catch(next);
    } else {
        res.status(401).end();
    }
});

/**
 * @swagger
 * /api/cw/company/<id>:
 *  get:
 *      tags: [Company]
 *      description: Get A Specific Company
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema: 
 *              type: integer
 *            description: Company ID
 *      responses:
 *          '200':
 *              description: Successfully Found
 *              schema:
 *                  $ref: '#/components/Company'
 */
router.get('/:id', (req, res, next) => {
    if (req.role.admin || req.role.cw.company.includes("read")) {
        req.cw.getCompanyById(req.params.id).then(comp => {
            res.send(comp);
        }).catch(next);
    } else {
        res.status(401).end();
    }
});

/**
 * @swagger
 * /api/cw/company/<id>/tickets:
 *  get:
 *      tags: [Company]
 *      description: Get A Company's Open Tickets
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema: 
 *              type: integer
 *            description: Company ID
 *      responses:
 *          '200':
 *              description: Successfully Found
 *              schema:
 *                  type: array
 *                  items:
 *                      $ref: '#/components/Ticket'
 */
router.get('/:id/tickets', (req, res, next) => {
    if (req.role.admin || req.role.cw.company.includes("read")) {
        req.cw.getCompanyTickets(req.params.id, req.query.page, req.query.pageSize, req.query.search).then(tickets => {
            res.send(tickets);
        }).catch(next);
    } else {
        res.status(401).end();
    }
});

/**
 * @swagger
 * /api/cw/company/<name>/lookup:
 *  get:
 *      tags: [Company]
 *      description: Translate ConnectWise name to Company ID
 *      parameters:
 *          - in: path
 *            name: name
 *            required: true
 *            schema:
 *              type: string
 *            description: Company Identifier
 *      responses:
 *          '200':
 *              description: Success
 *              schema:
 *                  type: integer
 *                  description: Company ID
 *          '404':
 *              description: Not Found
 *          '401':
 *              description: Unauthroized 
 */
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