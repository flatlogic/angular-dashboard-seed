var usersData = require('../data')('users');;
var u = require('../util');

exports.configure = function(app) {
    app.get('/api/profile/', u.requestHelper(getOne));
    app.put('/api/profile/', u.requestHelper(update));
};

function getOne(req){
    var id = req.user.id;
    return usersData.getOne(id).then(_hidePassword);
}

function update(req){
  return usersData.getOne(req.user.id).then(function(staleUser) {
    var updateInfo = req.body;
    if (updateInfo.password !== staleUser.password) {
      throw {statusCode: 401, message: 'Wrong password'};
    }
    var updatedUser = {
      password: updateInfo.newPassword || staleUser.password,
      email: updateInfo.email || staleUser.email,
      username: updateInfo.username || staleUser.username,
      id: staleUser.id
    };
    return usersData.update(updatedUser).then(_hidePassword);
  });
}

function _hidePassword(user) {
    return u.hidePassword(user);
}

