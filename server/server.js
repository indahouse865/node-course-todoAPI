require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const {ObjectID} = require("mongodb");
const {mongoose} = require("./db/mongoose");
const {Todo} = require("./models/todo");
const {User} = require("./models/user");
const {authenticate} = require("./middleware/authenticate");

let app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post("/todos", authenticate, (req, res) => {
    let todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get("/todos", authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get("/todos/:id", authenticate, (req, res) => {
    let id = req.params.id;
    //validate id
    if (!ObjectID.isValid(id)) {
        return res.status(404).send("Invalid object ID");
    }

    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send("NO ID FOUND");
        }

        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
});

app.delete("/todos/:id", authenticate, async (req, res) => {
    
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send("Invalid object ID");
    }

    try {
        const todo = await Todo.findOneAndRemove({
            _id: id,
            _creator: req.user._id
        });
        if (!todo) {
            return res.status(404).send("NO ID FOUND");
        }
        res.send({todo});
    } catch (e) {
        res.status(400).send("Other error catch");
    }
});

app.patch("/todos/:id", authenticate, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ["text", "completed"]);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send("Invalid object ID");
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    //findOneAndUodate
    //add creator to query
    Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            return res.status(404).send("404 - ID does not exist");
        }

        res.send({todo});
    }).catch((e) => {
        res.status(400).send("400");
    });
});

// POST /users
app.post("/users", async (req, res) => {
    try {
        let body = _.pick(req.body, ["email", "password"]);
        let user = new User(body);
        await user.save();
        let token = await user.generateAuthToken();
        res.header("x-auth", token).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});

app.get("/users/me", authenticate, (req, res) => {
    res.send(req.user);
});

// POST /users/login {email, password}
app.post("/users/login", async (req, res) => {
    try {
        const body = _.pick(req.body, ["email", "password"]);
        let user = await User.findByCredentials(body.email, body.password);
        let token = await user.generateAuthToken();
        res.header("x-auth", token).send(user);
    } catch(e) {
        res.status(400).send();
    };
});

app.delete("/users/me/token", authenticate, async (req, res) => {
    try {
        await req.user.removeToken(req.token)
        res.status(200).send();
    } catch (e) {
        res.status(400).send();
    }
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};
