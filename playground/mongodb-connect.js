//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log("Unable to connect to MongoDB server");
    }
    console.log("Connected to MongoDB");
    const db = client.db('TodoApp');

    // db.collection("Todos").insertOne({
    //     text: "something to do",
    //     completed: false
    // }, (err, res) => {
    //     if (err) {
    //         return console.log("Unable to insert Todo", err);
    //     }
    //
    //     console.log(JSON.stringify(res.ops, undefined, 2));
    // });

    db.collection("Users").insertOne({
        name:       "David Estrich",
        age:        23,
        location:   "Boston"
    }, (err, res) => {
        if (err) {
            return console.log("Unable to write to user instance");
        }
        console.log(JSON.stringify(res.ops[0]._id.getTimestamp(), undefined, 2));
    });

    client.close();
});
