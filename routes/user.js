var express = require('express');
var router = express.Router();
let Cart = require("../models/cart")
let passport = require("passport");
let csrf = require("csurf");
const {Product} = require("../models/product");
let {
  Order
} = require("../models/order");
let csrfProtection = csrf();
router.use(csrfProtection);
router.get("/additems", isLoggedIn, (req, res, next) => {
  let messages = req.flash("error");
  res.render("user/addItems", {
    csrfToken: req.csrfToken(),
    messages,
    hasError: messages.length > 0
  });

})
router.post("/additems", isLoggedIn, (req, res, next) => {
let product= new Product({
  imagePath:req.body.url,
  title:req.body.title,
  description:req.body.description,
  price:req.body.price
  })
  product.save().then(()=>{
res.render("user/additems",{
  success:" Your Item is successfully added to game-cart"
})
  }).catch(err => {
   console.log(err)
   res.render("user/additems",{
    error:"An Error Occur while Uploading the file"
  })
  })
})

router.get("/profile", isLoggedIn, (req, res, next) => {

 let userName = ""
 let name =req.user.email;
 for(let i = 0; i<name.length;i++){
   if(name[i] === '@'){
     break;
   }
   userName+=name[i]
 }
 console.log(userName)
  Order.find({
      user: req.user
    })
    .then((orders) => {
      let cart;
      console.log(orders);
      orders.forEach(order => {
        cart = new Cart(order.cart);
        order.items = cart.genrateArray();
      })
      console.log(orders)
      res.render("user/profile", {
        orders,
        userName
      });
    })
    .catch(e => {
      res.write("Err")
    })


})
router.get("/logout", isLoggedIn, (req, res, next) => {
  req.logout(); //method added by passport
  res.redirect("/");
})
router.use("/", notLoggedIn, (req, res, next) => {
  next();
})

router.get("/signup", (req, res, next) => {
  let messages = req.flash("error")
  res.render("user/signup", {
    csrfToken: req.csrfToken(),
    messages,
    hasError: messages.length > 0
  })
})
router.post("/Signup", passport.authenticate("local.signup", {
  failureRedirect: "signup",
  failureFlash: true
}), function (req, res, next) {
  if (req.session.oldUrl) {
    let oldUrl = req.session.oldUrl
    req.session.oldUrl = null;
    console.log(req.session);
    res.redirect(oldUrl);

  } else {
    res.redirect("/user/profile")
  }
});

router.get("/profile", isLoggedIn, (req, res, next) => {
  res.render("user/profile");

})

router.get("/signin", (req, res, next) => {
  let messages = req.flash("error")
  res.render("user/signin", {
    csrfToken: req.csrfToken(),
    messages,
    hasError: messages.length > 0
  })
})
router.post("/signin", passport.authenticate("local.signin", {
  failureRedirect: "signin",
  failureFlash: true //this middleware function excute if we passed sucessfully
}), function (req, res, next) {
  if (req.session.oldUrl) {
    let oldUrl = req.session.oldUrl
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    res.redirect("/user/profile")
  }
})

module.exports = router;

function isLoggedIn(req, res, next) { //to protect other routes only access if logged in
  //isAuthenticated method is added by passport
  //which automatically checked if iam sucessfully loged in its set to true
  if (req.isAuthenticated()) {
    console.log("what going on")
    return next();
  }
  console.log("IS it or not")
  res.redirect("/");
}

function notLoggedIn(req, res, next) {

  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}