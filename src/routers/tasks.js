const express = require('express');
const Task = require('../db/modals/task');
const router = new express.Router();


router.get('/tasks', (req, res) => {
    //console.log(req.body)
    Task.find().then((result) => {
        res.send(result);
    }).catch((error) => {
        res.status(500).send({ message: error.message });
    });
});

router.get('/tasks/:id', (req, res) => {
    //console.log(req.params)
    Task.findById(req.params.id).then((result) => {
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

router.post('/tasks', (req, res) => {
    //console.log(req.body);
    let task = new Task(req.body)
    task.save().then((result) => {
        res.send(result);
    }).catch((error) => {
        res.status(400).send({ message: error.message });
    });
});

router.delete('/tasks/:id', (req, res) => {
    //console.log(req.params)
    Task.findById(req.params.id).then((result) => {
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

router.patch('/tasks/:id', async (req, res) => {
    const notAllowedUpdates = ['user_id', '_id', 'id']
    const isValidUpdate = Object.keys(req.body).every((update) => {
        return !notAllowedUpdates.includes(update)
    })
    if (!isValidUpdate) {
        res.status(400).send({ error: 'Contains Invalid update key' })
    }
    else {
        try {
            const user = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
            if (!user) {
                res.status(404).send();
            } else {
                res.send(user)
            }
        } catch (error) {
            res.status(500).send({ error: error.message })
        }
    }
    return
})

module.exports = router;