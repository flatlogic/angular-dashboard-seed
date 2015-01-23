var usersData = require('../data/stubs/users');
var auth = require('./auth');


exports.configure = function(app) {
    app.get('/profile/', auth.ensureAuthenticated, requestHelper(getOne));
    app.put('/profile/', auth.ensureAuthenticated, requestHelper(update));
};

function requestHelper(func) {
    return function(req, res) {
        return func(req).then(function(data) { res.send(data); }, function(err) { res.send(err) });
    };
}

function getOne(req){
    var id = req.user.id;
    return usersData.getOne(id);
}

function update(req){
    var user = req.body;
    user.id = req.user.id;
    return usersData.update(user);
}

