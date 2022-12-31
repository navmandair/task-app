const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    description:{
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(value && value.length > 150){
                throw new Error('Task description too long')
            }
            if(value && value.length < 2){
                throw new Error('Task description too short')
            }
        }
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, { timestamps: true })

const Task = mongoose.model('Task', taskSchema)

module.exports = Task