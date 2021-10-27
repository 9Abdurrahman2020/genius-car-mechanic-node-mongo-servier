const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000;

const cors = require('cors')
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y7ez2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function server(){
    try{
        await client.connect();
        const database = client.db('car_mechanic');
        const servicesCollection = database.collection('services');
        // post api
        app.post('/service', async(req,res)=>{
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            res.json(result)
        })
        // get api
        app.get('/services', async(req,res)=>{
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray()
            res.send(services)
        })
        // get single data 
        app.get('/services/:id', async(req,res)=>{
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await servicesCollection.findOne(query)
            res.send(service)
        })
        // delete method
        app.delete('/services/:id', async(req,res)=>{
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })
        // update api 
        app.put('/update/:id', async(req,res)=>{
            const id = req.params.id;
            const service = req.body;
            const query = { _id: ObjectId(id)}
            const serviceDoc ={
                $set: {
                    name: service.name,
                    description: service.description,
                    price: service.price,
                    img: service.img
                }
            }
            const result = await servicesCollection.updateOne(query, serviceDoc)
            res.send(result)
            
        })
    }
    finally{
        // await client.close()
    }

}
server().catch(console.dir)

app.get('/', (req,res)=>{
    res.send('Genius mechanic sever is running')
})
app.listen(port, ()=>{
    console.log('The server is running in port : ', port);
})