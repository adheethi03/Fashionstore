const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    url: { type: String, required: true } 
})

const Product = mongoose.model('productsnew',productSchema)
module.exports = Product