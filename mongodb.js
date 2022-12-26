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

    db.collection('users').insertOne({task: 'Clean the house', completed: false}).then((result)=>{
        console.log(result);
    }).catch(error =>{
        throw error;
    })

});


