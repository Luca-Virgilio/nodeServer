const express = require ('express');
const bodyParser = require ('body-parser');
const expressLayouts = require ('express-ejs-layouts');
const flash = require('connect-flash');
const session = require ('express-session');
const passport = require('passport');


const {mongoose} = require ('./db');

// Passport Config
require('./config/passport')(passport);

// start web server
var app = express();

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//init middleware to parse every request into json object
//app.use(bodyParser.json()); 
app.use(express.urlencoded({extended:false}));

// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );
  // Passport middleware
app.use(passport.initialize());
app.use(passport.session());
  
  
  // Connect flash
  app.use(flash());
  
  // Global variables
  app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });
  

//Routes
app.use('/', require('./routes/all'));
app.use('/users', require('./routes/users'));



//define port
const PORT = process.env.PORT || 8000 ; 

//select port
app.listen(PORT, () => console.log('Server starting at port '+ PORT));