var q = require('q');
var stubs = [
    {
        id: 1,
        title: 'New admission in October',
        description: 'Light Blue - is a next generation admin template based on the latest Metro design. There are few reasons we want to tell you, why we have created it: We didn't like the darkness of most of admin templates, so we created this light one. We didn't like the high contrast of most of admin templates, so we created this unobtrusive one. We searched for a solution of how to make widgets look like real widgets, so we decided that deep background - is what makes widgets look real. ',
        date: "2015-01-07T15:10:13.022Z"
    },
    {
        id: 2,
        title: 'Software Testing Foundations',
        description: "Why don't use Lore Ipsum? I think if some one says don't use lore ipsum it's very controversial point. I think the opposite actually. Everyone knows what is lore ipsum - it is easy to understand if text is lore ipsum. You'll automatically skip - because you know - it's just non-informative stub. But what if there some text like this one? You start to read it! But the goal of this text is different. The goal is the example. So a bit of Lore Ipsum is always very good practice. Keep it in mind! Awesome text that stands out",
        date: "2015-05-24T14:40:36.022Z"
    },
    {
        id: 3,
        title: 'Web Applications with Ruby on Rails',
        description: 'Not just usual Metro. But something bigger. Not just usual widgets, but real widgets. Not just yet another admin template, but next generation admin template.',
        date: "2015-02-01T09:01:25.022Z"
    },
    {
        id: 4,
        title: ' Javascript & Databases. Web Developer 2.0 lesson 14',
        description: 'You will never know exactly how something will go until you try it. You can think three hundred times and still have no precise result.',
        date: "2015-10-29T16:41:58.022Z"
    },
    {
        id: 5,
        title: 'Flatlogic news',
        description: 'The Great Prince of the Grand Duchy of Lithuania he had stopped the invasion to Europe of Timur (Tamerlan) from Asia heading a big Army of Belarusians, Lithuanians.',
        date: "2015-03-16T18:20:04.022Z"
    },
    {
        id: 6,
        title: 'Appearence & Plugins',
        description: "Yes you can! Further more, you should! It let's you create really beautiful images either for elements or for the entire background.",
        date: "2015-04-30T01:08:18.022Z"
    }
];

var lastStubIndex = stubs.length;

function getAll() {
    return q(stubs);
}

function getOne(id) {
    var post = null;
    stubs.some( function(stub)  {
        post = stub.id == id ? stub : null;
        return post;
    });
    return q(post);
}

function save(post) {
    post.id = ++lastStubIndex;
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

exports.getAll =  getAll;
exports.getOne = getOne;
exports.remove = remove;
exports.update = update;
exports.save = save;
