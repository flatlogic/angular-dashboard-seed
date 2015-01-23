
exports.requestHelper = _requestHelper;

function _requestHelper(func) {
    return function(req, res) {
        return func(req).then(function(data) { res.send(data); }, function(err) { res.send(err) });
    };
}
