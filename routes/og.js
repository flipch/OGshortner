var express = require('express');
var path = require('path');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  let baseUrl = req.baseUrl;
  baseUrl = baseUrl.slice(4, baseUrl.length);
  if(baseUrl == ''){
    res.render('test', { title: 'Express' });
  }else{
    res.sendFile('./public/uploads/' + baseUrl + '/index.html', { root: __dirname + '/..' });
  }
});
module.exports = router;
