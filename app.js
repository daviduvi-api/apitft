var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var db = require('knex') ({
  client: 'sqlite3',
  connection: {
    filename: "./tft.db"
  }
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.get('/api/tft/champions', function (req, res){
  db.select().from("champions")
      .then(function (data){
        res.json(data);
      }).catch(function (error){
    console.log(error);
  });
});

app.get('/api/tft/champions/:id', function (req, res){
  var id = parseInt(req.params.id);

  db.select().from("champions").where("id", id)
      .then(function (data){
        res.json(data);
      }).catch(function (error){
    console.log(error);
  });
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
