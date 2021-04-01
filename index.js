const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectId= require('mongodb').ObjectId;
const bodyParser = require('body-parser')
const cors= require('cors')
require('dotenv').config()

const port = process.env.PORT || 8000

app.use(cors());
app.use(bodyParser.json());



app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.usuec.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection err',err);
  const productsCollection = client.db("OnlineShop").collection("products");

app.get('/products',(req,res)=>{
    productsCollection.find()
    .toArray((err,items)=>{
        res.send(items)
      
    })
})

app.get('/checkout/:_id',(req, res)=>{
  console.log(req.params._id)
  productsCollection.find({_id:ObjectId(req.params._id)})
 
  .toArray((err,documents)=>{
      res.send(documents[0]);
  })
})


  app.post('/addProduct',(req,res)=>{
    const newProduct = req.body;
    console.log('adding new product',newProduct);

    productsCollection.insertOne(newProduct)
    .then(result=>{
        console.log('inserted count',result.insertedCount);
        res.send(result.insertedCount>0)
    })
})   


 // client.close();
});


app.listen(port)