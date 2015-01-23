var q = require('q');
var stubs = [
    {
        id: 1,
        title: 'post1',
        description: 'post 1 description'
    },
    {
        id: 2,
        title: 'post2',
        description: 'post 2 description'
    },
    {
        id: 3,
        title: 'post3',
        description: 'post 3 description'
    },
    {
        id: 4,
        title: 'post4',
        description: 'post 4 description'
    },
    {
        id: 5,
        title: 'post5',
        description: 'post 5 description'
    },
    {
        id: 6,
        title: 'post6',
        description: 'post 6 description'
    }
];

function getAll() {
    return q(stubs);
};

function getOne(id) {
    var post = null;
    stubs.some( function(stub)  {
        post = stub.id == id ? stub : null;
        return post;
    });
    return q(post);
};

function save(post) {
    post.id = stubs.length + 1;
    stubs.push(post);
    return q(post);
}

function update(post) {
    var stubToUpdateIndex = _getStubIndexById(post.id);
    stubs[stubToUpdateIndex] = post;
    return q(post);
}

function remove(id) {
    var stubToDeleteIndex = _getStubIndexById(id);
    stubToDeleteIndex != -1 && stubs.splice(stubToDeleteIndex,1);
    return q(stubToDeleteIndex != -1 && id);
};

function _getStubIndexById(id) {
    var stubIndex = -1;
    stubs.some( function(stub, index)  {
        var isFound = stub.id == id;
        stubIndex = isFound ? index : -1
        return isFound;
    });
    return stubIndex;
};

exports.getAll =  getAll;
exports.getOne = getOne;
exports.remove = remove;
exports.update = update;
exports.save = save;
