var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose=require('mongoose');
const flash = require('connect-flash');
const session =require('express-session');
const passport = require('passport');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const Contacts=require('./models/Contacts');
require('dotenv').config();

require('./config/passport')(passport);
const db=process.env.MONGO_KEY;

//connect to mongo
mongoose.connect(db,{useNewUrlParser: true})  //url parser is formality
    .then(() => console.log('Mongodb connected'))
    .catch(err => console.log(err));

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//6.express session
app.use(session({      //no idea what these are
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

//9. passport middleware
app.use(passport.initialize());
app.use(passport.session());


//7.connect flash
app.use((flash()));  //we get a flash message and store it in a session, (in render we just reload with new values)

//8.global vars
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');

    next();

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
