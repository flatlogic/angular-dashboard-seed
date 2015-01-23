var usersData = require('../data/stubs/users');
var u = require('../util');

exports.configure = function(app) {
    app.get('/profile/', u.requestHelper(getOne));
    app.put('/profile/', u.requestHelper(update));
};

function getOne(req){
    var id = req.user.id;
    return usersData.getOne(id);
}

function update(req){
    var user = req.body;
    user.id = req.user.id;
    return usersData.update(user);
}

