var passport = require('passport');

exports.configure = function(app) {
    app.post('/api/login', _login);
    app.get('/api/logout', _logout);
}

function _login(req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err)
        }
        if (!user) {
            return res.status(401).send({message: info.message});
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.send(req.user);
        });
    })(req, res, next);
}

function _logout(req, res) {
    var id = req.user && req.user.id;
    req.logout();
    res.send({id: id});
}


