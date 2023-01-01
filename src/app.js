const db = require('./db/mongoose');
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const result = dotenv.config()
if (result.error) {
    throw result.error
}

// You will find some handlers done in diffrent way, 
// that is intentional to display implementations diffrent ways to for same end goal
const usersRouter = require('./routers/users');
const tasksRouter = require('./routers/tasks');

app.use(express.json());
app.use(usersRouter);
app.use(tasksRouter);

const port = process.env.PORT || 3000;

const startServer = (PORT) => { app.listen(PORT, () => { console.log(`Express server started on Port ${PORT}`) }) };

app.get('', (req, res) => {
    res.send({message: 'Connected to the server'});
});


db.init().then(() => { startServer(port) }).catch((error) => { throw error; });