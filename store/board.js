var express = require('express');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var mysql = require('mysql');
var conn = require('../db/db_con')();
var config = require('../db/db_selector');

var app = express();
var router = express.Router();
app.use(session({
  #CONFIG
}));

var outputs = [];

router.get('/', function(req, res, next) {
  new Promise( (resolve, reject) => {
    conn.query("SELECT * FROM products", function(error, results, fields) {
      if(error) {
        console.log(error);
        reject(error);
      } else {
        outputs.push(results);
        resolve(results);
      }
    });
  }).then ( () => {
    console.log(outputs);
    res.render('board', {products: outputs});
  })
})
module.exports = router;