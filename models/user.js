const mongoose = require("mongoose");
let bcrypt = require("bcryptjs");
let userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    facebookId: String,
  googleId: String,
});
userSchema.methods.encryptPassword = function(password){
return bcrypt.hashSync(password,bcrypt.genSaltSync(5),null);
}
userSchema.methods.validPassword= function(password){
    return bcrypt.compareSync(password,this.password)
    }
// userSchema.pre('save', function (next) {
//     var user = this;
//     if (user.isModified('password')) {
//         bcrypt.genSalt(10, (err, salt) => {
//             bcrypt.hash(user.password, salt, (err, hash) => {
//                 user.password = hash;
//                 next();
//             });
//         });
//     } else {
//         next();
//     }
// });
// UserSchema.statics.findByCredentials = function (email, password) {
//     let User = this;
//     return User.findOne({
//         email
//     }).then(user => {
//         if (!user) {
//             return Promise.reject();
//         }
//         return bcrypt.compare(password, user.password).then(res => {
//                 if (!res) {
//                     return Promise.reject()
//                 } else {
//                     return user
//                 }
//             })
//             .catch(e => res.status(400).send({}))
//     })
// }
let User = mongoose.model("users", userSchema)

module.exports = {
    User
}
