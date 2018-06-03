const login = require('facebook-chat-api');
const fs = require('fs');

/**
 * @summary Log in to FB and creates an API context
 * @returns {Promise}
 */
module.exports = new Promise(function(resolve, reject) {
  try {
    login({ email: process.env.email, password: process.env.password }, { userAgent: process.env.userAgent }, (err, api) => {
      if (err) {
        reject(err);
        return console.error(err);
      }
      fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));
      resolve(api);
    });
  } catch (err) {
    reject(err);
  }
});
