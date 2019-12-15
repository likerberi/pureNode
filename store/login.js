var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bkfd2Password = require('pbkdf2-password');
var hasher = bkfd2Password();

var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var app = express();
var config = require('../db/db_selector');

var mysql_con = require('../db/db_con'); // comparative

app.use(session({
  secret: '432984252#!%#!$',
  resave: false,
  saveUninitialized: true,
  store: new MySQLStore({
    host: config.host,
    port: 3306,
    user: config.user,
    password: config.password,
    database: config.database,
  })
}));

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('login');
});

// accounts, products shares their DB..(macro) 

// sample & admin
var accounts = [
    {
      username: 'testUser',
      password: 'test1234',
      authId: 'undefined',
      salt:'likerberi',
      displayName:'TESTACCOUNT',
    }
];

passport.serializeUser(function(account, done) {
    done(null, account.username);
});

passport.deserializeUser(function(id, done) {
    for(var i=0; i<accounts.length; i++) {
        var account = accounts[i];
        if(account.username === id) {
           return done(null, account);
        }
    }
    // 이후 접속할 때마다 deserialize만 실행 by session.

    // default
    // User.findById(id, function(err, account) {
    //     done(err, account);
    // });
})

passport.use(new LocalStrategy(
    function(username, password, done) {
        var uname = username;
        var pwd = password;
        for(var idx=0; idx<accounts.length; idx++) {
            var account = accounts[idx];
            if(uname === account.username) {
                return hasher({password:pwd, salt:account.salt}, function(err, pass, salt, hash) {
                if(hash === account.password) {
                    done(null, account);
                } else {
                    done(null, false);
                    console.log('entered in pp');
                    //res.redirect('/login');
                }
            })}
        }       
        done(null, false);
        console.log('entered in pp');
    }
));
  
// router,, transfer?
router.post('/', passport.authenticate('local', {
    successRedirect: '/board',
    failureRedirect: '/login',
    failureFlash: false // show msg once
}))

module.exports = router;