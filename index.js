const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const port=process.env.PORT||5000;
const app = express();
app.use(express.json());
app.use(cors());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://nafiz:${process.env.DB_PASS}@cluster0.qt8enez.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const categoriesCollection=client.db("tv-bazar").collection("category");
const reviewsCollection=client.db("tv-bazar").collection("reviews");
const productsCollection=client.db("tv-bazar").collection("products");
const ordersCollection=client.db("tv-bazar").collection("orders");
const users=client.db("tv-bazar").collection("users");


app.get('/',(req,res)=>{
    res.send("hello world")
});

app.get('/category',async(req,res)=>{
    try{
        const categories=await categoriesCollection.find({}).toArray();
        res.send(categories);
    }catch{
        // res.status(404)
    }
});

app.get('/reviews',async(req,res)=>{
    try{
        const reviews=await reviewsCollection.find({}).toArray();
        res.send(reviews);
    }catch{
        // res.status(404)
    }
});

app.get('/products',async(req,res)=>{
    try{
        const products=await productsCollection.find({}).toArray();
        res.send(products);
    }catch{

    }
});

app.get('/shop',async(req,res)=>{
    try{
        const query=req.query;
        const products= await productsCollection.find(query).toArray();
        res.send(products);
    }catch{

    }
});

app.post('/orders',async(req,res)=>{
    try{
        const orderInfo=req.body;
        const result=await ordersCollection.insertOne(orderInfo);
        res.send(result);
    }catch{

    }
});


app.post('/user',async(req,res)=>{
    try{
        const userInfo=req.body;
        const result=await users.insertOne(userInfo);
        res.send(result);
    }catch{

    }
});


app.get('/user/:email',async(req,res)=>{
    try{
        const email=req.params.email;
        const query={
            email:email
        }
        const result=await users.find(query).toArray();
        res.send(result);
    }catch{

    }
});

app.get('/dashboard/myOrder',async(req,res)=>{
    const email=req.headers.email;
    const query={
        email:email
    };
    const user=await users.find(query).toArray();
    if(user[0].role==="buyer"){
        const orderQuery={
            buyersEmail:email
        }
        const orders=await ordersCollection.find(orderQuery).toArray();
        const productId=orders.map(order=>order.productId);
        const products=await productsCollection.find({}).toArray();
        
        const OrderedProducts=productId.map((id)=>{
            const product= products.find(pro=>pro._id==id);
            return {
                productName:product.productName,
                productImg:product.img,
                productPrice:product.resalePrice
            };
        })
        res.send(OrderedProducts);
    }
})


app.listen(port,()=>{
    console.log("listening on port",port);
});