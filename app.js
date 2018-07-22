var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let expressHbs = require("express-handlebars")
var indexRouter = require('./routes/index');  
let userRouter = require("./routes/user");
let mongoose = require("mongoose");
let session = require("express-session");
let passport = require("passport");
let flash = require("connect-flash");
let validator = require("express-validator");
let monogoStore = require("connect-mongo")(session);//export the function which we need to pass section
const MongoDB = require("./bin/config");
var app = express();


app.disable('x-powered-by');
let database = `mongodb://${MongoDB.credentails.username}:${MongoDB.credentails.password}@ds243491.mlab.com:43491/shopping-cart-nodejs`;
mongoose.connect(database).then(res => console.log("Connected")).catch(err => console.log(err));
require("./config/passport");
// view engine setup
app.engine(".hbs",expressHbs({defaultLayout:"layout",extname:".hbs"})) //so it will always serach .hbs file
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator())
app.use(cookieParser());
app.set('trust proxy', 1);
// by default express-session is saved in memory which is bad for production and cause memory leaks
app.use(session({secret:"yourmomgay",
resave:false,//we are telling store not to open any new connection but use existing connection instead
saveUninitialized:false,
store: new monogoStore({mongooseConnection:mongoose.connection}),
cookie:{maxAge:180 * 60 * 1000}//min sec milisec cookie how much long is session
})) // if resave set to true
//session will be saved on a server on each request no matter something changed or not
//same for saveUnitialized session will be stored on the server even if its not intaitalized
app.use(flash());
app.use(passport.initialize());
app.use(passport.session())//to store the users
app.use(express.static(path.join(__dirname, 'public')));
//ordering is important as if we have index.js first all my routes and will not
//reach thee user js file
app.use((req,res,next)=>{
 res.locals.login = req.isAuthenticated()  //set a golbal varible in the view by using local keyword
 res.locals.session = req.session

 next();
});
app.use("/user",userRouter);
app.use('/', indexRouter);



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
