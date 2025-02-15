const express = require('express')
const mongoose = require("mongoose")
const jwt = require('jsonwebtoken')
const app = express()
const port =7000
const cors = require("cors")

app.use(express.json()); 
app.use(cors())

app.get('/',(req,res)=>{
    res.send('from the server')
})

async function main() {
    await mongoose.connect(
        "mongodb+srv://adheethi2003:2ySCBdVEiftjJT6@cluster0.iio96.mongodb.net/E48DB"
    );
}

main().then(()=>console.log('DB connected')).catch((err) => console.log(err))

const Product = require('./model/Product')
app.get('/products',async(req,res)=>{
    try {
        const products = await Product.find()
        res.status(200).json(products)
    } catch (error) {
        res.status(400).json(error)
    }
})


//Create a product

app.post("/products", async (req, res) => {
  try {
    const { name, price, description, url } = req.body;

    console.log("Received data:", req.body); // Log received request body for debugging

    const newProduct = new Product({
      name,
      price,
      description,
      url,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error); // Log the full error object
    res
      .status(400)
      .json({
        message: "Error creating product"
        });
  }
});


//Update a Product

app.patch('/products/:id',async(req,res)=>{
    try {
        const productId = req.params.id
        const product = await Product.findByIdAndUpdate(productId,req.body,{new:true})
        res.status(200).json(product)
    } catch (error) {
        res.status(400).json(error)
    }
})

//Delete Product

//Get product count for price greater than input price
app.get('/products/count/:price',async(req,res)=>{
  try {
    const price = Number(req.params.price)
    console.log(price)
    const productCount = await Product.aggregate([
      {
        $match:{price:{$gt:price}}
      },
      {
        $count:'productCount'
      }
    ])
    res.status(200).send(productCount)
  } catch (error) {
     res.status(400).json(error);
  }
})




//Require User

const User = require('./model/user')
//Registration
app.post('/user',async(req,res)=>{
  try {
    var userItem ={
      name:req.body.name,
      email:req.body.email,
      password:req.body.password,
      createdAt:new Date()
    }
    var user = new User(userItem)
    await user.save()
    res.status(201).json(user)
  } catch (error) {
     res.status(400).json(error);
  }
})


//Login
app.post('/login', async(req,res)=>{
  try {
     const {email,password}=req.body
     const user = await User.findOne({email:email})
     if(!user){
      return res.status(500).json({error:"User not Found"})
     }
     const isValid = (password == user.password)
     if(!isValid){
      return res.status(500).json({error:'Invalid Credentials'})
     }
     //Token
     let payload = {user:email}
     const secretKey = 'secret123'
     let token = jwt.sign(payload,secretKey)
     res.status(200).json({message:"Login Successfully",token:token})

  } catch (error) {
     res.status(400).json(error);
  }
})

app.listen(port,()=>{
    console.log("Server Started")
})