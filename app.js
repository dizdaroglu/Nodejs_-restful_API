var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//connect DB;
var mongoose = require('mongoose');
let options = {
  db: { native_parser: true },
  server: { poolSize: 5 },
  user: 'dizdaroglu',                // mlab.com > user !!!
  pass: 'fd113685'                 // mlab.com > user !!!
}
//use native promises
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://<user>:<pass>@ds022228.mlab.com:22228/rook', options).then( //user = mlab.com > user
  () => {                                                                               //pass = mlab.com > pass
    console.log("conncet db basarılı")
  },
  err => {
    console.log('connect basarısız')
  }
)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
