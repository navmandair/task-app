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
        if(!result) {
            res.status(404).send({message: 'no user found!'})
        }
        else {
            res.send(result);
        }
        
    }).catch((error)=>{
        res.status(500).send({message: error.message});
    });
});

app.get('/tasks/:id', (req, res) => {
    //console.log(req.params)
    Task.findById(req.params.id).then((result) => {
        if(!result) {
            res.status(404).send({message: 'no task found!'})
        }
        else {
            res.send(result);
        }
    }).catch((error)=>{
        res.status(500).send({message: error.message});
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

app.delete('/tasks/:id', (req, res) => {
    //console.log(req.params)
    Task.findById(req.params.id).then((result) => {
        if (!result) {
            return null
        }
        else {
            return Task.findByIdAndDelete(req.params.id)
        }
    }).then((result) =>{
        if (!result) {
            res.status(404).send({ message: 'no task found!' })
        }
        else {
            res.send({ id: result.id })
        } 
    }).catch((error) => {
        res.status(500).send({ message: error.message }); 
    });
});


app.delete('/users/:id', async (req, res) => {
    //console.log(req.params)
    try {
        let user = await User.findById(req.params.id)
        if (!user) {
            res.status(404).send({ message: 'no user found!' })
        } else {
            let result = await User.findByIdAndDelete(req.params.id)
            if (!result) {
                res.status(404).send({ message: 'cannot delete user!' })
            }
            else {
                res.send({ id: req.params.id })
            }
        }
    }catch(error){
        res.status(500).send({error: error.message});

    }
    return
});

app.patch('/users/:id', async(req, res)=>{
    const allowedUpdates = ['name', 'password']
    const isValidUpdate = Object.keys(req.body).every((update)=>{
        return allowedUpdates.includes(update)
    })
    if(!isValidUpdate){
        res.status(400).send({error : 'Contains Invalid update key'})
    } else{

    try{
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if(!user){
            res.status(404).send({error: 'User not found!'});
        }else{
            res.send(user)
        }
    }catch(error){
        res.status(500).send({error: error.message})
    }
}
    return
})

app.patch('/tasks/:id', async(req, res)=>{
    const notAllowedUpdates = ['user_id', '_id', 'id']
    const isValidUpdate = Object.keys(req.body).every((update)=>{
        return !notAllowedUpdates.includes(update)
    })
    if(!isValidUpdate){
        res.status(400).send({error : 'Contains Invalid update key'})
    }
    else{
        try{
            const user = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
            if(!user){
                res.status(404).send();
            }else{
                res.send(user)
            }
        }catch(error){
            res.status(500).send({error: error.message})
        }
    }
    return
})


db.init().then(()=> {startServer(port)}).catch((error)=> { throw error;});