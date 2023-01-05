const express = require('express');
const app = express();

/*const dotenv = require('dotenv');
const result = dotenv.config()
if (result.error) {
    throw result.error
}*/

// You will find some handlers done in diffrent way, 
// that is intentional to display implementations diffrent ways to for same end goal
const usersRouter = require('./users');
const tasksRouter = require('./tasks');

app.use(express.json());
app.use(usersRouter);
app.use(tasksRouter);

const PORT = process.env.PORT || 3000;

const startServer = (port = PORT) => { app.listen(port, () => { console.log(`Express server started on Port ${port}`) }) };

app.get('', (req, res) => {
    res.send({message: 'Connected to the server'});
});

module.exports = {
    app,
    startServer
}