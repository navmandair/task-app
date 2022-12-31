const express = require('express');
const Task = require('../db/modals/task');
const User = require('../db/modals/user');
const router = new express.Router();
const auth = require('../middleware/auth')

router.get('/tasks', (req, res) => {
    //console.log(req.body)
    Task.find().then((result) => {
        res.send(result);
    }).catch((error) => {
        res.status(500).send({ message: error.message });
    });
});

router.get('/tasks/me', auth, async (req, res) => {
    try{
        const doc = await User.findById(req.user._id).populate('tasks');
        res.send(doc.tasks)
    }catch(error){
        res.status(500).send()
    }    
});

router.get('/tasks/:id', auth, (req, res) => {
    //console.log(req.params)
    Task.findOne({_id: req.params.id, owner: req.user._id}).then((result) => {
        if (!result) {
            res.status(404).send({ message: 'no task found!' })
        }
        else {
            res.send(result);
        }
    }).catch((error) => {
        res.status(500).send({ message: error.message });
    });
});

router.post('/tasks', auth, (req, res) => {
    //console.log(req.body);
    let task = new Task({...req.body, owner: req.user._id})
    task.save().then((result) => {
        res.send(result);
    }).catch((error) => {
        res.status(400).send({ message: error.message });
    });
});

router.delete('/tasks/:id', auth, (req, res) => {
    //console.log(req.params)
    Task.findOne({_id: req.params.id, owner: req.user._id}).then((result) => {
        if (!result) {
            return null
        }
        else {
            return Task.findByIdAndDelete(req.params.id)
        }
    }).then((result) => {
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

router.patch('/tasks/:id', auth, async (req, res) => {
    const allowedUpdates = ['description', 'completed']
    const isValidUpdate = Object.keys(req.body).every((update) => {
        return allowedUpdates.includes(update)
    })
    if (!isValidUpdate) {
        res.status(400).send({ error: 'Contains Invalid update key' })
    }
    else {
        try {
            const task = await Task.findOne({_id: req.params.id, owner: req.user._id})

            if (!task) {
                res.status(404).send();
            } else {
                allowedUpdates.forEach((key)=>{
                    if(req.body[key]){
                        task[key] = req.body[key]
                    }
                })
                await task.save()
                res.send(task)
            }
        } catch (error) {
            res.status(500).send({ error: error.message })
        }
    }
    return
})

module.exports = router;