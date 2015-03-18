var q = require('q');
var stubs = [
    {
        id: 1,
        username: 'user1',
        email: 'user1@email.com',
        password: 'user1pass'
    },
    {
        id: 2,
        username: 'user2',
        email: 'user2@email.com',
        password: 'user2pass'
    },
    {
        id: 3,
        username: 'user3',
        email: 'user3@email.com',
        password: 'user3pass'
    },
    {
        id: 4,
        username: 'user4',
        email: 'user4@email.com',
        password: 'user4pass'
    },
    {
        id: 5,
        username: 'user5',
        email: 'user5@email.com',
        password: 'user5pass'
    },
    {
        id: 6,
        username: 'user6',
        email: 'user6@email.com',
        password: 'user6pass'
    }
];

var lastStubIndex = stubs.length;

function getAll() {
    return q(stubs);
}

function getOne(id) {
   return getOneBy({id: id});
};

function getOneBy(queryProperty) {
    var propertyName = Object.keys(queryProperty)[0];
    var propertyValue = queryProperty[propertyName];
    var user = null;
    stubs.some( function(stub)  {
        user = stub[propertyName] == propertyValue ? stub : null;
        return user;
    });
    return q(user);
}

function save(user) {
    user.id = ++lastStubIndex;
    stubs.push(user);
    return q(user);
}

function update(user) {
    var stubToUpdateIndex = _getStubIndexById(user.id);
    stubs[stubToUpdateIndex] = user;
    return q(user);
}

function remove(id) {
    var stubToDeleteIndex = _getStubIndexById(id);
    stubToDeleteIndex != -1 && stubs.splice(stubToDeleteIndex,1);
    return q(stubToDeleteIndex != -1 && id);
}

function _getStubIndexById(id) {
    var stubIndex = -1;
    stubs.some( function(stub, index)  {
        var isFound = stub.id == id;
        stubIndex = isFound ? index : -1
        return isFound;
    });
    return stubIndex;
}

exports.getOne = getOne;
exports.getOneBy = getOneBy;
exports.getAll =  getAll;
exports.remove = remove;
exports.update = update;
exports.save = save;
