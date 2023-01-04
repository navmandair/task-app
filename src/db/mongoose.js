const mongoose = require('mongoose');
/*
const dotenv = require('dotenv')
const result = dotenv.config()
if (result.error) {
  throw result.error
}
*/
const uri = process.env['DB_URL']
const dbName = process.env['DB_NAME']

mongoose.set('strictQuery', true);
const startDatabaseServer = () => mongoose.connect(uri, { dbName: dbName, useNewUrlParser: true }).then(()=> {console.log('Database is connected');}).catch((error)=> { throw error;});

exports.init = startDatabaseServer;