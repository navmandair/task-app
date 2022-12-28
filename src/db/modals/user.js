const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid email address')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(value && value.toLowerCase().includes('password')){
                throw new Error('Not secure password !')
            }
        }
    },
    verified: {
        type: Boolean,
        default: false
    }
})

userSchema.pre('save', async function (next){
    let user = this;
    //console.log('before save :', user)
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 9) // should use variable
    }
    //console.log('after save :', user)
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User