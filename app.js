require('dotenv').config();

var cookieParser = require('cookie-parser');
var createError = require('http-errors');
var log = require('./config/erhandle');
var express = require('express');
var logger = require('morgan');
var path = require('path');
var cors = require('cors');

//Sequilize Model Initialization
var db = require('./models');
var User = require('./models/user')(db.sequelize, db.Sequelize.DataTypes);

var app = express();

//Routers
var apiRouter = require('./routes/api')(User, log);
var authRouter = require('./routes/auth')(User, log);

//CORS
app.use(cors());
app.options('*', cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // send error
  res.status(err.status || 500);
  res.send("Error " + (err.status?err.status:500) + " " + err.message);
});

module.exports = app;
