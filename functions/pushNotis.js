const firebase = require('firebase-admin');
const getThreadInfo = require('./getThreadInfo');
const getUserInfo = require('./getUserInfo');
const login = require('./auth/loginAppstate');
const deviceToken = process.env.debugDeviceToken;

module.exports = async function(api) {
  api.listen(async (err, event) => {
    if (err) return console.error(err);
    const threadInfo = await getThreadInfo(api, event.threadID);

    // Get the title of this thread.
    // 1. Check for supplied name
    // 2. If no name && group then just say 'Group Message'
    // 3. If no name && 1-1 then figure out other person's userId and fetch their name
    let title = threadInfo.threadName;
    if (!title && threadInfo.isGroup) {
      title = 'Group Message';
    } else if (!title && !threadInfo.isGroup) {
      let otherPerson = threadInfo.participantIDs[0];
      if (otherPerson === process.env.selfId) otherPerson = threadInfo.participantIDs[1];
      title = (await getUserInfo(api, otherPerson)).name;
    }
    if (!title) title = 'Undefined';

    const payload = {
      data: {
        message: event.body,
        thread: event.threadID,
        click_action: 'FLUTTER_NOTIFICATION_CLICK'
      },
      notification: {
        title: title,
        body: event.body
      }
    };
    firebase
      .messaging()
      .sendToDevice(deviceToken, payload)
      .then(function(response) {
        console.log('Successfully sent message:', response);
      })
      .catch(function(err) {
        throw err;
      });
  });
};
