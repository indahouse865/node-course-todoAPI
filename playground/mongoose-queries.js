const {ObjectID} = require("mongodb");

const {mongoose} = require("./../server/db/mongoose");
const {Todo} = require("./../server/models/todo");
const {User} = require("./../server/models/user");

let id = "5b4d6e625d5b342cc07e51c51";

if (!ObjectID.isValid(id)) {
    console.log("ID not valid");
}

Todo.find({
    _id: id
}).then((todos) => {
    console.log("Todos", todos);
});

Todo.findOne({
    _id: id
}).then((todo) => {
    console.log("Todo", todo);
});

Todo.findById(id).then((todo) => {
    if (!todo) {
        return console.log("ID not found");
    }
    console.log("Todo by id", todo);
}).catch((e) => console.log(e));

let userId = "5b421aea46ee963428825f20";

User.findById(userId).then((user) => {
    if (!user) {
        return console.log("No user found");
    }
    console.log(user, undefined, 2);
}).catch((e) => console.log(e));
