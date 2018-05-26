const userMap = {};

module.exports = async function(api, userId) {
  return new Promise(function(resolve, reject) {
    if (userMap[userId] !== undefined) {
      return resolve(userMap[userId]);
    }
    console.log('Id not cached');
    api.getUserInfo(userId, function(err, obj) {
      if (err) {
        console.error(err);
        return reject(err);
      }
      const user = obj[userId];
      userMap[userId] = { name: user.name, avatar: user.thumbSrc };
      resolve({ name: user.name, avatar: user.thumbSrc });
    });
  });
};
