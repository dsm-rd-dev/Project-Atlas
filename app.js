require('dotenv').config();

var cookieParser = require('cookie-parser');
var createError = require('http-errors');
var log = require('./config/erhandle');
var swaggerUi = require('swagger-ui-express');
var docsOptions = require('./config/docs');
var express = require('express');
var passport = require('passport');
var logger = require('morgan');
var path = require('path');
var cors = require('cors');

//Sequilize Model Initialization
var db = require('./models');
var app = express();

app.use(passport.initialize());
require('./config/passport')(passport, db);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(docsOptions));

//Routers
var apiRouter = require('./routes/api')(db, log, passport);
var authRouter = require('./routes/auth')(db, log, passport);

//CORS
const approvedOrigins = [
  "vcd.cloud.dsm.net",
  "localhost",
  "10.70.117.180"
]
app.use(cors());
app.options('*', cors());
app.use(function(req, res, next) {
  var origin = req.get('origin');
  if(approvedOrigins.includes(origin)){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  }
  next();
});

app.get('/test', (req, res, next) => {
  res.send({"Test": "test"});
})

//Body Parsing
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Router Declarations
app.use('/api', apiRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  log.errFail(err.message);
  log.errFail(err);

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err);
  // send error
  res.status(err.status || 500);
  res.send({ status: err.status, message: err.message });
});

module.exports = app;
