const login = require('facebook-chat-api');
const fs = require('fs');

module.exports = function (appstate) {
  return new Promise(function(resolve, reject) {
  login({appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8'))},
        (err, api) => {
      if(err) {
        reject(err);
        return console.error(err);
      }
      resolve(api);
    });
  });
}
