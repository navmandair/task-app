const db = require('../../src/db/mongoose');
const User = require('../../src/db/modals/user');
const Task = require('../../src/db/modals/task');
const jwt = require('jsonwebtoken');

const testUserId = new db.mongoose.Types.ObjectId(); 
const testUser = {
    _id: testUserId,
    name: 'Nav',
    email: 'test@test.com',
    password: 'Pass@1234',
    tokens: [{
        token: jwt.sign({_id: testUserId}, process.env.JWT_TOKEN_KEY)
    }]
}

const testUser2Id = new db.mongoose.Types.ObjectId(); 
const testUser2 = {
    _id: testUser2Id,
    name: 'Nav',
    email: 'test2@test2.com',
    password: 'Pass@1234',
    tokens: [{
        token: jwt.sign({_id: testUser2Id}, process.env.JWT_TOKEN_KEY)
    }]
}

const task1 = {
    _id: new db.mongoose.Types.ObjectId() ,
    description: 'clean the house',
    completed: false,
    owner: testUserId
}

const task2 = {
    _id: new db.mongoose.Types.ObjectId(),
    description: 'complete the node js course',
    completed: true,
    owner: testUser2Id
}

const task3 = {
    _id: new db.mongoose.Types.ObjectId(),
    description: 'complete the react course',
    completed: false,
    owner: testUser2Id
}

const setupDatabase = async () =>{
    if(db.mongoose.connection.readyState == 0){
        await db.init();
    }
    await Task.deleteMany();
    await User.deleteMany();
    await new User(testUser).save();
    await new User(testUser2).save();
    await new Task(task1).save();
    await new Task(task2).save();
    await new Task(task3).save();
}

const cleanupDatabase = async () =>{
    await db.mongoose.disconnect();
}

module.exports = {
    setupDatabase,
    cleanupDatabase,
    testUser,
    testUserId,
    testUser2,
    testUser2Id,
    task1
}