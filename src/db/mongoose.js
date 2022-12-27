const mongoose = require('mongoose');

const dotenv = require('dotenv')
const result = dotenv.config()
if (result.error) {
  throw result.error
}

const dbPassword = process.env['DB_PASSWORD']
const uri = `mongodb+srv://beta:${dbPassword}@betacluster.ar6fn.mongodb.net/?retryWrites=true&w=majority`;
const dbName = 'task-app-db'

mongoose.set('strictQuery', true);
const startDatabaseServer = () => mongoose.connect(uri, { dbName: dbName, useNewUrlParser: true }).then(()=> {console.log('Database is connected');}).catch((error)=> { throw error;});

exports.init = startDatabaseServer;