require('dotenv').config();
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var firebase = require('firebase-admin');

var login = require('./functions/auth/loginPassword');
var echo = require('./functions/echo');
var pushNotis = require('./functions/pushNotis');

var recents = require('./routes/recents');
var friends = require('./routes/friends');
var thread = require('./routes/thread');

exports.appPromise = login.then(api => {
  var app = express();

  // Load api context
  app.use((req, res, next) => {
    req.api = api;
    next();
  });

  app.use((req, res, next) => {
    if (req.query['apikey'] !== process.env.apikey) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    } else {
      next();
    }
  });

  var serviceAccount = require('./firebaseAccount.json');
  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: 'https://messenger-e5298.firebaseio.com'
  });

  //  app.use(echo(api));
  pushNotis(api);

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, 'public')));

  app.use('/recents', recents);
  app.use('/friends', friends);
  app.use('/thread', thread);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handlers

  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      console.error(JSON.stringify(err));
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    console.error(JSON.stringify(err));
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });

  return app;
});
