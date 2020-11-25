const mongoose=require('mongoose');
var bcrypt=require('bcrypt-nodejs');
const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }/*,
    date:{
        type: Date,
        required: Date.now
    }*/
});

UserSchema.methods.encryptPassword=function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(5),null);
  };
  UserSchema.methods.validPassword=function(password){
    return bcrypt.compareSync(password,this.password);
  };

const User=mongoose.model('User',UserSchema);
module.exports=User;