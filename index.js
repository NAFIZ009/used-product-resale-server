const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const port=process.env.PORT||5000;
const app = express();
app.use(express.json());
app.use(cors());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://nafiz:${process.env.DB_PASS}@cluster0.qt8enez.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const categoriesCollection=client.db("tv-bazar").collection("category");
const reviewsCollection=client.db("tv-bazar").collection("reviews");


app.get('/',(req,res)=>{
    res.send("hello world")
});

app.get('/category',async(req,res)=>{
    try{
        const categories=await categoriesCollection.find({}).toArray();
        res.send(categories);
    }catch{
        res.status(404)
    }
});

app.get('/reviews',async(req,res)=>{
    try{
        const reviews=await reviewsCollection.find({}).toArray();
        res.send(reviews);
    }catch{
        res.status(404)
    }
});



app.listen(port,()=>{
    console.log("listening on port",port);
});