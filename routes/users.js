const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/User.js');

//Login page
router.get('/login', (req,res) =>{
    res.render('login');
});

// Register page
router.get('/register', (req,res) =>{
    res.render('register');
});

//Registration request
router.post('/register', (req, res)=>{
    //console.log(req.body);
    
    const {name, email, password, password2} = req.body;
    let errors = [];

    // check required field
    if(!name || !email || !password || !password2){
        errors.push({msg:'Pelase fill all the field'});
    }
    // check passwords match
    if(password !== password2){
        errors.push({msg:'the passwords do not match'});
    }
    // check length passord
    if(password.length<6){
        errors.push({msg:'Password mast be at lest 6 charaters'});
    }

    if (errors.length > 0) {
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        User.findOne({ email: email }).then(user => {
          if (user) {
            errors.push({ msg: 'Email already exists' });
            res.render('register', {
              errors,
              name,
              email,
              password,
              password2
            });
          } else {
            const newUser = new User({
              name,
              email,
              password
            });
    
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                  .save()
                  .then(user => {
                    req.flash(
                      'success_msg',
                      'You are now registered and can log in'
                    );
                    res.redirect('/users/login');
                  })
                  .catch(err => console.log(err));
              });
            });
          }
        });
      }
    });

// Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
  });
  
  // Logout
  router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });

module.exports = router;