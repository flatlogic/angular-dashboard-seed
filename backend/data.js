/**
 * Created by smartapant on 27.1.15.
 */
module.exports = function(moduleName) {
    var provider = 'stubs';
    return require('./data/' + provider + '/' + moduleName);
};