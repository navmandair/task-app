const db = require('./db/mongoose');
const express = require('express');
const app = express();
const dotenv = require('dotenv')
const result = dotenv.config()
if (result.error) {
  throw result.error
}

app.use(express.json());

const User = require('./db/modals/user');
const Task = require('./db/modals/task');

const port = process.env.PORT || 3000;

const startServer = (PORT) => { app.listen(PORT, () => { console.log(`Express server started on Port ${PORT}`) }) };

app.get('', (req, res) => {
    res.send('Connected to the server');
});

app.get('/users', (req, res) => {
    //console.log(req.body)
    User.find().then((result) => {
        res.send(result);
    }).catch((error)=>{
        res.status(500).send({message: error.message});
    });
});

app.get('/tasks', (req, res) => {
    //console.log(req.body)
    Task.find().then((result) => {
        res.send(result);
    }).catch((error)=>{
        res.status(500).send({message: error.message});
    });
});

app.get('/users/:id', (req, res) => {
    //console.log(req.params)
    User.findById(req.params.id).then((result) => {
        res.send(result);
    }).catch((error)=>{
        res.status(404).send({message: 'no user found!'});
    });
});

app.get('/tasks/:id', (req, res) => {
    //console.log(req.params)
    Task.findById(req.params.id).then((result) => {
        res.send(result);
    }).catch((error)=>{
        res.status(404).send({message: 'no user found!'});
    });
});



app.post('/users', (req, res) => {
    //console.log(req.body);
    let user = new User(req.body)
    user.save().then((result) => {
        res.send(result);
    }).catch((error)=>{
        res.status(400).send({message: error.message});
    });
});

app.post('/tasks', (req, res) => {
    //console.log(req.body);
    let task = new Task(req.body)
    task.save().then((result) => {
        res.send(result);
    }).catch((error)=>{
        res.status(400).send({message: error.message});
    });
});


db.init().then(()=> {startServer(port)}).catch((error)=> { throw error;});