const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const Task = require('./task');

const jwtAuthTokenSignKey = process.env.JWT_TOKEN_KEY || 'NodeJSCourse'

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
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid email')
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
    },
    tokens: [{
        token : {
        type: String,
        required: true
    }}]
}, { timestamps: true })

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Unable to login')
    }
    const isMatch  = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('Unable to login')
    }
    return user;
}

userSchema.methods.generateAuthToken = async function(){
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, jwtAuthTokenSignKey);
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;

}

userSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject()
    delete userObject.password;
    delete userObject.tokens;

    return userObject;

}

userSchema.pre('save', async function (next){
    let user = this;
    //console.log('before save :', user)
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 9) // should use variable
    }
    //console.log('after save :', user)
    next()
})

userSchema.pre('remove', async function (next){
    let user = this;
    console.log(this)
    await Task.deleteMany({owner: user._id})
    next()
})

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

const User = mongoose.model('User', userSchema)

module.exports = User