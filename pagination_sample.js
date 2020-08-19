var express = require('express');
var mysql = require('mysql');
var router = express.Router();

let model = {
  getProducts: (offset, limit, callback) => {
      return conn.query("SELECT * FROM products LIMIT ?, ?", [+offset, +limit], callback)
  },
  getTotalProducts: (callback) => {
      return conn.query("SELECT COUNT(*) AS total FROM products", callback);
  }
}

router.get('/:offset/:limit', function(req, res) {
  let offset = req.params.offset;
  let limit = req.params.limit;
  model.getProducts(offset, limit, function(err, products) {
      if(err) {
          res.json(err)
      } else {
          model.getTotalProducts(function(err, result) {
              if(err) {
                  res.json(err)
              } else {
                  res.json({data: products, total: result[0].total});
              }
          })
      }
  })
})