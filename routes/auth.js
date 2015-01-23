var LocalStrategy = require('passport-local');
var usersData = require('./../data/stubs/users');
var passport = require('passport');

exports.configure = function(app) {
    app.post('/login', _login);
    app.get('/logout', _logout);
    passport.serializeUser(_serializeUser);
    passport.deserializeUser(_deserializeUser);
    passport.use(localStrategy);
}

exports.ensureAuthenticated = _ensureAuthenticated; //TODO: not awesome that ensureAuthenticated is used from routes module


var localStrategy = new LocalStrategy(
    function(username, password, done) {
        process.nextTick(function () {
            usersData.getOneBy({username: username}).then(function(user) {
                if (!user) {
                    return done(null, false, {message: 'Invalid username or password'});
                } else if (user.password != password) {
                    return done(null, false, {message: 'Invalid username or password'});
                } else {
                    return done(null, user);
                }
            }, function(err) {
                return done(err);
            })
        });
    }
);

function _login(req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err)
        }
        if (!user) {
            return res.send({message: info.message});
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.send(req.user); //TODO: password is sent along with the other information
        });
    })(req, res, next);
}

function _logout(req, res) {
    var id = req.user && req.user.id;
    req.logout();
    res.send({id: id});
}

function _serializeUser(user, done) {
    done(null, user.id);
};

function _deserializeUser(id, done) {
    usersData.getOne(id).then(function (user) {
        done(null, user);
    }, function(err) {
        done(err);
    });
};

function _ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login'); //TODO: not awesome
}



