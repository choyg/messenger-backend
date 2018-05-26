const login = require('facebook-chat-api');
const fs = require('fs');

/**
 * @summary Log in to FB and creates an API context
 * @returns {Promise}
 */
module.exports = new Promise(function(resolve, reject) {
  try {
    login({ appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8')) }, (err, api) => {
      if (!err) return resolve(api);
      console.error('Could not login from past session');
      console.error(err);
      login({ email: process.env.email, password: process.env.password }, (err, api) => {
        if (err) {
          reject(err);
          return console.error(err);
        }
        fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));
        resolve(api);
      });
    });
  } catch (err) {
    next(err);
  }
});
