let mongoose = require("mongoose");
// let Schema = mongoose.Schema;

let productSchema =  new mongoose.Schema({
imagePath:{
    type:String,
    required:true
},
title:{
    type:String,
    required:true
},
description:{
    type:String,
    required:true
},
price:{
    type:Number,
    required:true
}
});

let Product = mongoose.model('product', productSchema);

module.exports ={
    Product
}