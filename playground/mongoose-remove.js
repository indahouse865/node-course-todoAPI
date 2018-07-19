const {ObjectID} = require("mongodb");

const {mongoose} = require("./../server/db/mongoose");
const {Todo} = require("./../server/models/todo");
const {User} = require("./../server/models/user");

Todo.remove({}).then((result) => {
    console.log(result);
});

Todo.findOneAndRemove( {_id: '5b500e4c02e2242a4778e8d7'} ).then((todo) => {
    console.log(todo);
});

Todo.findByIdAndRemove('5b500e4c02e2242a4778e8d7').then((doc) => {
    console.log(doc);
});
