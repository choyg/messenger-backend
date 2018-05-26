const login = require('./auth/loginAppstate');

module.exports = async function(api) {
  api.listen((err, event) => {
    if (err) return console.error(err);
    switch (event.type) {
      case 'message':
        if (event.body === '/stop') {
          api.sendMessage('Goodbye…', event.threadID);
          return stopListening();
        }
        api.sendMessage(event.body, event.threadID);
        break;
      case 'event':
        console.log(event);
        break;
    }
  });
};
