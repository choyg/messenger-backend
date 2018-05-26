var express = require('express');
var router = express.Router();
var login = require('../functions/auth/loginAppstate');

/* GET recent threads */
router.get('/', async function(req, res, next) {
  try {
    req.api.getThreadList(10, null, [], function(err, list) {
      if (err) next(err);
      const mappedMsgs = list.map(thread => {
        // Extract the snippet sender's nickname/name
        let senderName = thread.nicknames.find(n => n.userID === thread.snippetSenderf);
        if (senderName) senderName = senderName.nickname;
        else senderName = thread.participants.find(p => p.userID === thread.snippetSender).name;

        return {
          threadID: thread.threadID,
          name: thread.name || 'Group Message',
          message: `${senderName}: ${thread.snippet}`
        };
      });
      res.send(mappedMsgs);
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
