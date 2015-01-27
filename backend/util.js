exports.requestHelper = _requestHelper;
exports.hidePassword = _hidePassword;

function _requestHelper(func) {
    return function(req, res) {
        return func(req).then(function(data) { res.send(data); }, function(err) { res.send(err) });
    };
}

function _hidePassword(user) {
    var clonedUser = JSON.parse(JSON.stringify(user));  //cloning user object
    delete clonedUser.password;
    return clonedUser;
}
