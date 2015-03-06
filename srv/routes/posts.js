var postsData = require('../data')('posts');
var u = require('../util');

exports.configure = function(app) {
    app.get('/api/posts', u.requestHelper(getAll));
    app.get('/api/posts/:id', u.requestHelper(getOne));
    app.post('/api/posts/', u.requestHelper(save));
    app.delete('/api/posts/:id', u.requestHelper(remove));
    app.put('/api/posts/:id', u.requestHelper(update));
};

function getAll() {
   return postsData.getAll();
}

function getOne(req) {
    var id = req.params.id;
    return postsData.getOne(id);
}

function save(req) {
    var post = req.body;
    return postsData.save(post);
}

function update(req) {
    var id = req.params.id;
    var post = {
        id: id,
        date: req.body.date,
        title: req.body.title,
        description: req.body.description
    };
    return postsData.update(post);
}

function remove(req) {
    var id = req.params.id;
    return postsData.remove(id);
};


