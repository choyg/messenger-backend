module.exports = async function(api, threadId, amount, timestamp) {
  return new Promise(function(resolve, reject) {
    api.getThreadHistory(threadId, amount, timestamp, function(err, info) {
      if (err) {
        reject(err);
      }
      resolve(info);
    });
  });
};
