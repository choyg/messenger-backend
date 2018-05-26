var express = require('express');
var router = express.Router();
var login = require('../functions/auth/loginAppstate');

/* GET list of friends */
router.get('/', async function(req, res, next) {
  req.api.getFriendsList(function(err, arr) {
    if (err) next(err);
    res.send(arr);
  });
});

module.exports = router;
