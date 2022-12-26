const mongoose = require('mongoose');

const User = require('./modals/user');
const Task = require('./modals/task');

const dotenv = require('dotenv')
const result = dotenv.config()
if (result.error) {
  throw result.error
}

const dbPassword = process.env['DB_PASSWORD']
const uri = `mongodb+srv://beta:${dbPassword}@betacluster.ar6fn.mongodb.net/?retryWrites=true&w=majority`;
const dbName = 'task-app-db'

mongoose.set('strictQuery', true);
mongoose.connect(uri, { dbName: dbName, useNewUrlParser: true }).then(()=> {console.log('Database is connected')}).catch((error)=> { throw error;});


const user = new User({
    name: 'N',
    email: 'test@gmail.com',
    password: 'testPasswor    '
})

user.save();