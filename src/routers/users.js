const express = require('express');
const User = require('../db/modals/user');
const router = new express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');
const { sendEmail } = require('../email');

const avatar_uploader = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
   
        if(file.originalname.toLowerCase().endsWith('.jpg') || file.originalname.toLowerCase().endsWith('.jpeg') || file.originalname.toLowerCase().endsWith('.png')){
            cb(undefined, true)
        } else{
            cb(new Error('Invalid file type, Only Support .jpg, .jpeg or .png'))
        }
    }
});

router.get('/users', (req, res) => {
    //console.log(req.body)
    User.find().then((result) => {
        res.send(result);
    }).catch((error) => {
        res.status(500).send({ message: error.message });
    });
});

router.get('/users/me', auth, (req, res) => {
    res.send(req.user)
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
    user.verificationCode = (Math.random() + 1).toString(36).substring(6);
    user.save().then((result) => {
        return result.generateAuthToken()
    }).then((token) => {
        sendEmail(user.email, 'Verify Account', `Hi ${user.name},\nWelcome to the To Do App, Your verification code is ${user.verificationCode}`)
        res.status(201).send({user, token});
    }).catch((error) => {
        res.status(400).send({ message: error.message });
    });
});


router.post('/users/me/avatar', auth, avatar_uploader.single('avatar'), async (req, res) => {
    //console.log(req.body);
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    let user = req.user;
    user.avatar = buffer;
    user.save().then((result) => {
        res.status(200).send();
    }).catch((error) => {
        res.status(400).send({ message: error.message });
    });
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
});

router.delete('/users/me/avatar', auth, async (req, res) => {
    //console.log(req.body);
    let user = req.user;
    user.avatar = null;
    user.save().then((result) => {
        res.status(200).send();
    }).catch((error) => {
        res.status(400).send({ message: error.message });
    });
});

router.get('/users/:id/avatar', async (req, res) => {
    try{
        let user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error('Avatar missing!')
        }
        res.set('Content-Type', 'image/png');
        res.status(200).send(user.avatar);
    } catch(error){
        res.status(400).send({error: error.message});
    }
    return 
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

router.post('/users/logout', async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token !== req.token
        })
        await req.user.save();
        res.send({message: 'logged out'})
    } catch (error) {
        res.status(400).send({error: error.message})
    }
});

router.post('/users/logoutAll', async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save();
        res.send({message: 'logged out all sessions'})
    } catch (error) {
        res.status(400).send({error: error.message})
    }
});

router.delete('/users/me', auth, async (req, res) => {
    //console.log(req.params)
    try {
        await req.user.remove();
        sendEmail(req.user.email, 'Account Deleted', `Hi ${req.user.name},\nSorry to see you go.`)
        res.send(req.user)
    } catch (error) {
        res.status(500).send({ error: error.message });

    }
    return
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

router.patch('/users/me', auth, async (req, res) => {
    const allowedUpdates = ['name', 'password']
    const isValidUpdate = Object.keys(req.body).every((update) => {
        return allowedUpdates.includes(update)
    })
    if (!isValidUpdate) {
        res.status(400).send({ error: 'Contains Invalid update key' })
    } else {
        try {
            const user = await User.findById(req.user._id)
            if (!user) {
                res.status(404).send({ error: 'User not found!' });
            } else {
                allowedUpdates.forEach((key)=>{
                    if(req.body[key])
                    {
                        user[key] = req.body[key]
                    }
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
                    if(req.body[key])
                    {
                        user[key] = req.body[key]
                    }
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


router.get('/users/me/verify', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        if (req.query.code !== user.verificationCode) {
            res.status(404).send({ error: 'Invalid Code!' });
        } else {
            user.verified = true;
            await user.save()
            res.send(user)
        }
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
    return
})



module.exports = router;