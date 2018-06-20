//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log("Unable to connect to MongoDB server");
    }
    console.log("Connected to MongoDB");
    const db = client.db('TodoApp');

    // db.collection("Todos").find( {
    //     _id: new ObjectID("5b288f4229f67c8a4a423dcb")
    // } ).toArray().then((docs) => {
    //     console.log("TODOS");
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log("Unable to fetch todos", err);
    // });

    db.collection("Todos").find().count().then((count) => {
        console.log(`TODOS COUNT: ${count}`);
    }, (err) => {
        console.log("Unable to fetch todos", err);
    });

    // client.close();
});
