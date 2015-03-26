var LocalStrategy = require('passport-local');
var usersData = require('./data')('users');
var passport = require('passport');
var u = require('./util');

exports.configure = function() {
    passport.serializeUser(_serializeUser);
    passport.deserializeUser(_deserializeUser);
    passport.use(localStrategy);
}

exports.ensureAuthenticated = _ensureAuthenticated;

var localStrategy = new LocalStrategy(
    function(username, password, done) {
        process.nextTick(function () {
            usersData.getOneBy({username: username}).then(function(user) {
                if (!user || user.password != password) {
                    return done(null, false, {message: 'To login use user1/user1pass'});
                } else {
                    var noPassUser = u.hidePassword(user);
                    return done(null, noPassUser);
                }
            }, function(err) {
                return done(err);
            })
        });
    }
);

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
    res.status(401).send({message: 'Please, login first'});
}
