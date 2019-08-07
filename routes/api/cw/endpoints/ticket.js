var express = require('express');
var router = express.Router();

/**
 * @swagger
 * /api/cw/ticket:
 *  post:
 *      tags: [Ticket]
 *      description: Create New Support Ticket
 *      parameters:
 *          - in: body
 *            schema:
 *              $ref: '#/components/NewTicket'
 *      responses:
 *          '200':
 *              description: Successfully Created
 *              schema:
 *                  $ref: '#/components/Ticket'
 *          '401':
 *              description: 'Unauthroized'
 */
router.post('/', (req, res, next) => {
    if (req.role.admin || req.role.cw.ticket.includes("write")) {
        req.cw.createSupportTicket(req.body.summary, req.body.companyName, req.body.boardId).then(results => {
            res.set('Content-Type', 'application/json');
            res.send(results);
        }).catch(next);
    } else {
        res.status(401).end();
    }
});

/**
 * @swagger
 * /api/cw/ticket/<id>:
 *  get:
 *      tags: [Ticket]
 *      description: Get Ticket By Id
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: integer
 *              description: Ticket ID
 *      responses:
 *          '200':
 *              description: Successfully Found
 *              schema:
 *                  $ref: '#/components/Ticket'
 *          '404':
 *              description: 'Not Found'
 *          '401':
 *              description: 'Unauthroized'
 */
router.get('/:id', (req, res, next) => {
    if (req.role.admin || req.role.cw.ticket.includes("read")) {
        req.cw.getTicketById(req.params.id).then(results => {
            res.set('Content-Type', 'application/json');
            res.send(results);
        }).catch(next);
    } else {
        res.status(401).end();
    }
});

/**
 * @swagger
 * /api/cw/ticket/<id>:
 *  patch:
 *      tags: [Ticket]
 *      description: Update Ticket Status
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: integer
 *            description: App ID
 *          - in: body
 *            type: object
 *            properties:
 *              id:
 *                  type: integer
 *              status:
 *                  type: integer
 *      responses:
 *          '200':
 *              description: Successfully Updated
 *              schema:
 *                  $ref: '#/components/Ticket'
 *          '401':
 *              description: 'Unauthroized'
 */
router.patch('/:id', (req, res, next) => {
    if(req.role.admin || req.role.cw.ticket.includes("write")) {
        req.cw.updateTicketStatusById(req.params.id, req.body.status).then(ticket => {
            res.send(ticket);
        }).catch(next);
    } else {
        res.status(401).end();
    }
})

module.exports = router;