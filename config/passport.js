let passport = require("passport"); 
// if we set passport in other file we are creating diffrent intances 
//we are working with the same one
let {User} = require("../models/user");
let localStrategy = require("passport-local").Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
passport.serializeUser((user,done)=>{
    done(null,user.id);
//whenever we want storage the user in our session serialize the ID

});
passport.deserializeUser((id,done)=>{
User.findById(id,function(err,user){
    done(err,user);
})

});

passport.use("local.signup",new localStrategy({
    usernameField:"email",
    passwordField:"password",
    passReqToCallback:true
},(req,email,password,done)=>{
    req.checkBody("email","Invalid Email").notEmpty().isEmail();
    req.checkBody("password","Invalid Password").notEmpty().isLength({min:5});
    let errors = req.validationErrors();
    if(errors){
        let messages =[];
errors.forEach(error => messages.push(error.msg));
console.log(messages);
return done(null,false,req.flash("error",messages))
    }
User.findOne({email},function(err,user){
    if(err){
        return done(err);
    }
    if(user){
        return done(null,false,{message:"Email already in use"});
    }
    let newUser = new User();
    newUser.email=email;
    newUser.password= newUser.encryptPassword(password);
    newUser.save(function(err,result){
        if(err){
            return done(err);
        }
        return done(null,newUser)
    })
})
// let newUser =  new User;
// newUser.email = email;
// newUser.password = newUser.encryptPassword(password);
// newUser.save()
// .then(user => {
//     done(null,user)
// })
// .catch(e => {
//     console.log(e)
//     done(e)
// });
})
);
passport.use("local.signin",new localStrategy({
    usernameField:"email",
    passwordField:"password",
    passReqToCallback:true
},function(req,email,password,done){
    //validation check
    req.checkBody("email","Invalid Email").notEmpty().isEmail();
    req.checkBody("password","Invalid Password").notEmpty();
    let errors = req.validationErrors();
    if(errors){
        let messages =[];
errors.forEach(error => messages.push(error.msg));
console.log(messages);
return done(null,false,req.flash("error",messages))
    }
    User.findOne({email},function(err,user){
        if(err){
            return done(err);
        }
        if(!user){
            return done(null,false,{message:"No User found"});
        }
        if(!user.validPassword(password)){
            return done(null,false,{message:"Incorrect Password"});
        }
        return done(null,user);
    })
})
);

passport.use(new FacebookStrategy({
    clientID: '165528440943168',
    clientSecret: 'ab15fa7775eb49d07807379b8c180251',
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'email']
  }, function(accessToken, refreshToken, profile, next) {
      User.findOne({ facebookId: profile.id }, function(err, user) {
        if (user) {
          return next(err, user);
        } else {
          let newUser = new User();
          newUser.email = profile._json.email;
          newUser.facebookId = profile.id;
          newUser.save(function(err) {
            if (err) throw err;
            next(err, newUser);
          });
        }
      });
  }));