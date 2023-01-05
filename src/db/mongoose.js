const mongoose = require('mongoose');
const uri = process.env['DB_URL']
const dbName = process.env['DB_NAME']

mongoose.set('strictQuery', true);
const startDatabaseServer = () => mongoose.connect(uri, { dbName: dbName, useNewUrlParser: true }).then(()=> {}).catch((error)=> { throw error;});

exports.init = startDatabaseServer;
exports.mongoose = mongoose;