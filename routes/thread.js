var express = require('express');
var router = express.Router();
var login = require('../functions/auth/loginAppstate');
var getUserInfo = require('../functions/getUserInfo');
var getThreadInfo = require('../functions/getThreadInfo');
var getThreadHistory = require('../functions/getThreadHistory');

/* GET thread history*/
router.get('/:threadId/', async function(req, res, next) {
  const threadId = req.params.threadId;
  const amount = req.query.amount ? undefined : 25;
  const timestamp = req.query.timestamp;

  const promises = await Promise.all([
    getThreadHistory(req.api, threadId, amount, timestamp),
    getThreadInfo(req.api, threadId)
  ]);
  const threadHistory = promises[0];
  const threadInfo = promises[1];
  const users = await Promise.all(threadInfo.participantIDs.map(p => getUserInfo(req.api, p)));
  const userMap = {};
  threadInfo.participantIDs.map((p, index) => (userMap[p] = users[index]));

  threadHistory
    .map(message => {
      if (message.type !== 'message') {
        message.body = message.snippet;
      }
      message.senderName = userMap[message.senderID].name;
      message.senderAvatar = userMap[message.senderID].avatar;
    })
    .filter(Boolean);
  res.send(threadHistory);
});

module.exports = router;
