const db = require('./db/mongoose');
const {startServer} = require('./routers/app');;
const { connect } = require('./email');

db.init().then(async () => { console.log('Database is connected'); await connect(), startServer() }).catch((error) => { throw error; });