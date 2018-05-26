module.exports = async function(api, threadId) {
  return new Promise(function(resolve, reject) {
    api.getThreadInfo(threadId, function(err, info) {
      if (err) {
        reject(err);
      }
      resolve(info);
    });
  });
};
