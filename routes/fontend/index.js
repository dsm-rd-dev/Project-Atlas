var express = require('express');
const cw = require('../../connectors/cw');
var router = express.Router();

module.exports = (User) => {

  /* GET home page. */
  router.get('/', function (req, res, next) {
    if (req.session.passport) {
      User.findOne({where: {id: req.session.passport.user}}).then(user => {
        if (user == null) {
          res.status(500).end();
        } else {
          res.render('index');
        }
      });
    } else {
        res.render('index');
    }
  });

  router.get('/ticket/:id', (req, res, next) => {
    cw.getTicketById(req.params.id).then(results => {
      var info = [{
          title: "ID",
          info: results.id
        },
        {
          title: "Summary",
          info: results.summary
        },
        {
          title: "Contact",
          info: results.contact.name
        },
        {
          title: "Email",
          info: results.contactEmailAddress
        },
        {
          title: "Phone Number",
          info: results.contactPhoneNumber
        }
      ]
      res.render('report', {
        title: "Ticket Report",
        subhead: "Ticket Report: " + results.id,
        items: info
      });
    }).catch(error => {
      res.send(error);
    });
  });

  return router;
}