var express = require('express');
const cw = require('../connectors/cw');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/ticket/:id', (req, res, next) => {
  cw.getTicketById(req.params.id).then(results => {
    var info = [
      {
        title: "ID",
        info: results.id
      },
      {
        title: "Summary",
        info: results.summary
      }
    ]
    res.render('report', {title: "Ticket Report", subhead: "Ticket Report: " + results.id, items: info});
}).catch(error => {
    res.send(error);
});
  
});

module.exports = router;
