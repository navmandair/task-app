const express = require('express');
const User = require('../db/modals/user');
const router = new express.Router();

router.get('/users', (req, res) => {
    //console.log(req.body)
    User.find().then((result) => {
        res.send(result);
    }).catch((error) => {
        res.status(500).send({ message: error.message });
    });
});


router.get('/users/:id', (req, res) => {
    //console.log(req.params)
    User.findById(req.params.id).then((result) => {
        if (!result) {
            res.status(404).send({ message: 'no user found!' })
        }
        else {
            res.send(result);
        }

    }).catch((error) => {
        res.status(500).send({ message: error.message });
    });
});


router.post('/users', async (req, res) => {
    //console.log(req.body);
    let user = new User(req.body)
    user.save().then((result) => {
        return result.generateAuthToken()
    }).then((token) => {
        res.status(201).send({user, token});
    }).catch((error) => {
        res.status(400).send({ message: error.message });
    });
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (error) {
        res.status(400).send({error: error.message})
    }
});

router.delete('/users/:id', async (req, res) => {
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
    } catch (error) {
        res.status(500).send({ error: error.message });

    }
    return
});


router.patch('/users/:id', async (req, res) => {
    const allowedUpdates = ['name', 'password']
    const isValidUpdate = Object.keys(req.body).every((update) => {
        return allowedUpdates.includes(update)
    })
    if (!isValidUpdate) {
        res.status(400).send({ error: 'Contains Invalid update key' })
    } else {
        try {
            const user = await User.findById(req.params.id)
            
            if (!user) {
                res.status(404).send({ error: 'User not found!' });
            } else {
                allowedUpdates.forEach((key)=>{
                    user[key] = req.body[key]
                })
                await user.save()
                res.send(user)
            }
        } catch (error) {
            res.status(500).send({ error: error.message })
        }
    }
    return
})

module.exports = router;