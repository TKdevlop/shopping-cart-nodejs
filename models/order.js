let mongoose = require("mongoose");
// let Schema = mongoose.Schema;
let {User} = require("./user");
let orderSchema =  new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId, //this field hold the Id for user object
        ref:User
    },
    cart:{
        type:Object,
        required:true
    },
    address:{
        type:String,required:true
    },
    name:{
        type:String,required:true
    },
    paymentId:{
        type:String,required:true
    }
});

let Order = mongoose.model('order', orderSchema);

module.exports ={
    Order
}