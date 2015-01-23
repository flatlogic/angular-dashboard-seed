var postsData = require('../data/stubs/posts');
var auth = require('./auth');

exports.configure = function(app) {
    app.get('/posts', auth.ensureAuthenticated, requestHelper(getAll));
    app.get('/posts/:id', auth.ensureAuthenticated, requestHelper(getOne));
    app.post('/posts/', auth.ensureAuthenticated, requestHelper(save));
    app.delete('/posts/:id', auth.ensureAuthenticated, requestHelper(remove));
    app.put('/posts/:id', auth.ensureAuthenticated, requestHelper(update));
};

function requestHelper(func) {
    return function(req, res) {
        return func(req).then(function(data) { res.send(data); }, function(err) { res.send(err) });
    };
}


function getAll(){
   return postsData.getAll();
}

function getOne(req){
    var id = req.params.id;
    return postsData.getOne(id);
}

function save(req){
    var post = req.body;
    return postsData.save(post);
}

function update(req){
    var id = req.params.id;
    var post = {
        id: id,
        title: req.body.title,
        description: req.body.description
    };
    return postsData.update(post);
}

function remove(req){
    var id = req.params.id;
    return postsData.remove(id);
};


