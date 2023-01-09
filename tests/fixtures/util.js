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

const setupDatabase = async () =>{
    if(db.mongoose.connection.readyState == 0){
        await db.init();
    }
    await Task.deleteMany();
    await User.deleteMany();
    try {
        await new User(testUser).save();
    }
    catch {

    }
}

const cleanupDatabase = async () =>{
    await db.mongoose.disconnect();
}

module.exports = {
    setupDatabase,
    cleanupDatabase,
    testUser,
    testUserId
}