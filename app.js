require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var db = require('./models');
var User = require('./models/user')(db.sequelize, db.Sequelize.DataTypes);
var cors = require('cors');

var frontRouter = require('./routes/fontend/')(User);
var apiRouter = require('./routes/api')(User);
var authRouter = require('./routes/auth')(passport, User);

var app = express();
app.use(passport.initialize());
app.use(session({
  secret: "It's a secret to everyone",
  resave: true,
  saveUninitialized: true
}));
app.use(passport.session());

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', frontRouter);
app.use('/api', apiRouter);
app.use('/login', authRouter);

app.get('/express_backend', (req, res) => {
  res.send({ express: 'Your backend is working' });
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
