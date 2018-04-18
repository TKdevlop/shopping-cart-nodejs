var express = require('express');
var router = express.Router();
let csrf = require("csurf");
let {Product} = require(".././models/product");
let Cart = require("../models/cart");
let {Order} = require("../models/order");
/* GET home page. */
router.get('/', function(req, res, next) {
  let successMsg = req.flash("success")[0];

  Product.find()
  .then((products) => {
    let chunkedArr =[];
    let chunkSize = 4;
    for(let i = 0;i<products.length;i+=chunkSize){
  
      chunkedArr.push(products.slice(i,i+chunkSize))
    }
    res.render('shop/index', { title: 'ShoppingCart',products:chunkedArr ,successMsg,noMessage:!successMsg})
  })
  .catch(e => console.log(e))
});
router.get("/add-to-cart/:id",(req,res,next)=>{
let productId = req.params.id;
let cart = new Cart(req.session.cart? req.session.cart : {});
Product.findById(productId)
.then((product)=>{
  cart.add(product,product.id);
  req.session.cart = cart; // express session will automatically save so don't
  //save in the session

  console.log(req.session.cart);
  res.redirect("/");
})
.catch((e)=>{
  return res.redirect("/");
})
})

router.get("/addWithInCart/:id",(req,res,next)=>{
  let productId = req.params.id;
  let cart = new Cart(req.session.cart? req.session.cart : {});
  Product.findById(productId)
  .then((product)=>{
    cart.add(product,product.id);
    req.session.cart = cart; // express session will automatically save so don't
    //save in the session
  
    console.log(req.session.cart);
    res.redirect("/shoppingcart");
  })
  .catch((e)=>{
    return res.redirect("/");
  })
  })
router.get("/reduce/:id", function(req,res,next){
  let productId = req.params.id;
let cart = new Cart(req.session.cart? req.session.cart : {});
cart.reduceByOne(productId);
req.session.cart = cart;
res.redirect("/shoppingcart");
})
router.get("/remove/:id",function(req,res,next){
  let productId = req.params.id;
  let cart = new Cart(req.session.cart? req.session.cart : {});
  cart.removeAll(productId);
  req.session.cart = cart;
  res.redirect("/shoppingcart");
})
router.get("/shoppingcart",(req,res)=>{
  if(!req.session.cart){
    return res.render("shop/shoppingcart",{product:null});
  }
   let cart = new Cart(req.session.cart);
   res.render("shop/shoppingcart",{product:cart.genrateArray(),totalPrice:cart.totalPrice})
})

router.get("/checkout",isLoggedIn,(req,res,next)=>{
  if(!req.session.cart){
    return res.redirect("/shoppingcart");
  }
  let cart = new Cart(req.session.cart);
  let errMsg = req.flash("error")[0];
  res.render("shop/checkout",{product:cart.genrateArray(),total:cart.totalPrice,errMsg,noError:!errMsg})
})
router.post("/checkout",isLoggedIn,(req,res,next)=>{
  if(!req.session.cart){
    return res.redirect("/shoppingcart");
  }
  let cart = new Cart(req.session.cart);
  // Set your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
var stripe = require("stripe")("sk_test_JIrCfVj7bJ3N3qAYunNHDX2N");

// Token is created using Checkout or Elements!
// Get the payment token ID submitted by the form:
 // Using Express

stripe.charges.create({
  amount: cart.totalPrice * 100,//charege in penny
  currency: 'usd',
  description: 'Example charge',
  source: req.body.stripeToken,
},(err,charge)=>{
  if(err){
    req.flash("error",err.message);
    res.redirect("/checkout")
  }
  let order = new Order({
    user: req.user, // passport store in the user in the request field
    cart,
    address:req.body.address,// express store thee value send by post request
    name:req.body.name,
    paymentId:charge.id
  });
  order.save().then(result=>{
    req.flash("success","Product Successfully Purchased!");
    req.session.cart=null;
    res.redirect("/")
  }).catch(e => {
    res.redirect("/checkout");
  })

});

})
module.exports = router;
function isLoggedIn(req,res,next){
 
   if(req.isAuthenticated()){
       return next();
   }
   req.session.oldUrl = req.url
   res.redirect("/user/signin");
   }