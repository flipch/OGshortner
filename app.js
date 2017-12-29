var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var router = express.Router();
var shortid = require('shortid');
const fs = require('fs');

var index = require('./routes/index');
var users = require('./routes/users');
var og = require('./routes/og');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/og/*', og);

var Storage = multer.diskStorage({
  destination: function (req, file, callback) {
    //Req.ui = url
    //Req.body = params

    var fileContent = '<!DOCTYPE html><html lang="en"><head>';
    fileContent += '<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">';
    fileContent += '<title>' + req.body.title + '</title>';
    fileContent += '<meta property="og:title" content="' + req.body.title + '" />';
    fileContent += '<meta property="og:description" content="' + req.body.desc + '" />';
    fileContent += '<meta property="og:image" content="./uploads/' + req.ui + "/" + req.ui + file.originalname.substring(file.originalname.indexOf('.'), file.originalname.length) + '" />';
    fileContent += '<script>window.location = "' + req.body.link + '";</script>'
    fileContent += '</head><body><p>Please wait, you are being redirected...</p></body></html>';

   
    fs.mkdir(path.join(__dirname, 'public', 'uploads', req.ui), function () {
        fs.writeFile(path.join(__dirname, 'public', 'uploads', req.ui, 'index.html'), fileContent, (err) => {
           if (err) throw err;
           callback(null, path.join(__dirname, 'public', 'uploads', req.ui));
        });
    });
  },
  filename: function (req, file, callback) {
    callback(null, req.ui + file.originalname.substring(file.originalname.indexOf('.'), file.originalname.length));
  }
});

var upload = multer({
  storage: Storage
}).single('pic');

//tell express what to do when the route is requested
app.post('/fbshare', function (req, res, next) {
  req.ui = shortid();
  upload(req, res, function (err) {
    if (err) {
      return res.end("Something went wrong!");
    }
    return res.send(req.ui);
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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