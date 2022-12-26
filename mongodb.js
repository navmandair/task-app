// CRUD 

const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv')
const result = dotenv.config()
if (result.error) {
  throw result.error
}

const dbPassword = process.env['DB_PASSWORD']
const uri = `mongodb+srv://beta:${dbPassword}@betacluster.ar6fn.mongodb.net/?retryWrites=true&w=majority`;
const dbName = 'task-app-db'


const client = MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 }, (error, client)=>{
    if(error){
        throw error;
    }
    if(client){
        console.log('Connected to database!')
        //return client;
    }

    let db = client.db(dbName)

    db.collection('tasks').insertOne({task: 'Clean the house', completed: false}).then((result)=>{
        console.log(result);
    }).catch(error =>{
        throw error;
    })

    db.collection('tasks').insertMany([{task: 'Clean the car', completed: true}, {task: 'Clean the office', completed: true}]).then((result)=>{
        console.log(result);
    }).catch(error =>{
        throw error;
    })

    db.collection('tasks').findOne({completed: false}).then(result =>{
        console.log(result);
    }).catch(error => {
        throw error;
    })

    db.collection('tasks').find({completed: true}).toArray().then(result =>{
        console.log(result);
    }).catch(error => {
        throw error;
    })

    db.collection('tasks').deleteOne({task: 'Clean the house', completed: false}).then(result =>{
        console.log(result);
    }).catch(error => {
        throw error;
    })

});


